const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// 데이터베이스 초기화
const dbPath = path.join(__dirname, 'data');
const reservationsPath = path.join(dbPath, 'reservations.json');
const reviewsPath = path.join(dbPath, 'reviews.json');
const settingsPath = path.join(dbPath, 'settings.json');
const postsPath = path.join(dbPath, 'posts.json');

async function initDatabase() {
  try {
    await fs.mkdir(dbPath, { recursive: true });

    // 예약 데이터 초기화
    try {
      await fs.access(reservationsPath);
    } catch {
      await fs.writeFile(reservationsPath, JSON.stringify([], null, 2));
    }
    
    // 후기 데이터 초기화
    try {
      await fs.access(reviewsPath);
    } catch {
      await fs.writeFile(reviewsPath, JSON.stringify([], null, 2));
    }
    
    // 설정 데이터 초기화
    try {
      await fs.access(settingsPath);
    } catch {
      const defaultSettings = {
        pricing: {
          julnoon: { basic: 50000, premium: 70000 },
          'move-in-cleaning': { basic: 300000, premium: 450000 },
          'elastic-coat': { basic: 80000, premium: 120000 },
          'bathroom-remodeling': { basic: 2000000, premium: 3500000 }
        },
        discounts: {
          package2: 0.15,
          package3: 0.20
        }
      };
      await fs.writeFile(settingsPath, JSON.stringify(defaultSettings, null, 2));
    }
    
    // 블로그 포스트 데이터 초기화
    try {
      await fs.access(postsPath);
    } catch {
      await fs.writeFile(postsPath, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// 유틸리티 함수
async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// 라우트 - 정적 경로를 먼저 정의
app.get('/', async (req, res) => {
  const reviews = await readJSON(reviewsPath);
  const approvedReviews = reviews.filter(r => r.status === 'approved').slice(0, 6);
  
  res.render('index', {
    title: '전국 시공 가능한 전문 서비스',
    reviews: approvedReviews
  });
});

// 예약 페이지
app.get('/reservation', (req, res) => {
  res.render('reservation', {
    title: '온라인 예약'
  });
});

// 블로그 페이지 (공개) - 정적 경로이므로 먼저 정의
app.get('/blog', async (req, res) => {
  const { category } = req.query;
  let posts = [];
  try {
    posts = await readJSON(postsPath);
    if (!Array.isArray(posts)) posts = [];
  } catch (error) {
    posts = [];
  }
  
  let filteredPosts = posts.filter(p => p.status === 'published');
  
  if (category) {
    filteredPosts = filteredPosts.filter(p => p.category === category);
  }
  
  res.render('blog', {
    title: '블로그',
    posts: filteredPosts.reverse(),
    category: category
  });
});

app.get('/blog/:id', async (req, res) => {
  let posts = [];
  try {
    posts = await readJSON(postsPath);
    if (!Array.isArray(posts)) posts = [];
  } catch (error) {
    posts = [];
  }
  
  const post = posts.find(p => p.id === req.params.id && p.status === 'published');
  
  if (!post) {
    return res.status(404).render('404', { title: '404 - 페이지를 찾을 수 없습니다' });
  }
  
  // 조회수 증가
  post.views = (post.views || 0) + 1;
  const postIndex = posts.findIndex(p => p.id === req.params.id);
  if (postIndex !== -1) {
    posts[postIndex] = post;
    await writeJSON(postsPath, posts);
  }
  
  res.render('blog-post', {
    title: post.title,
    post: post
  });
});

// 관리자 라우트 (동적 라우트보다 먼저)
app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

app.get('/admin/login', (req, res) => {
  if (req.session.admin) {
    return res.redirect('/admin');
  }
  res.render('admin/login', { title: '관리자 로그인' });
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  // 간단한 인증 (실제로는 bcrypt 사용)
  if (username === 'admin' && password === 'admin123') {
    req.session.admin = true;
    res.redirect('/admin');
  } else {
    res.render('admin/login', { error: '로그인 정보가 올바르지 않습니다.' });
  }
});

app.get('/admin', async (req, res) => {
  if (!req.session.admin) {
    return res.redirect('/admin/login');
  }
  
  const reservations = await readJSON(reservationsPath);
  const reviews = await readJSON(reviewsPath);
  
  const stats = {
    todayReservations: reservations.filter(r => {
      const today = new Date().toDateString();
      return new Date(r.createdAt).toDateString() === today;
    }).length,
    pendingDeposits: reservations.filter(r => r.depositStatus === 'pending').length,
    pendingReviews: reviews.filter(r => r.status === 'pending').length,
    totalReservations: reservations.length
  };
  
  res.render('admin/dashboard', {
    title: '관리자 대시보드',
    stats: stats,
    recentReservations: reservations.slice(-10).reverse()
  });
});

app.get('/admin/reservations', async (req, res) => {
  if (!req.session.admin) {
    return res.redirect('/admin/login');
  }
  
  const reservations = await readJSON(reservationsPath);
  res.render('admin/reservations', {
    title: '예약 관리',
    reservations: reservations.reverse()
  });
});

app.get('/admin/reviews', async (req, res) => {
  if (!req.session.admin) {
    return res.redirect('/admin/login');
  }
  
  const reviews = await readJSON(reviewsPath);
  res.render('admin/reviews', {
    title: '후기 관리',
    reviews: reviews.reverse()
  });
});

// 블로그 콘텐츠 관리 (정적 경로이므로 동적 라우트보다 먼저)
app.get('/admin/posts', async (req, res) => {
  console.log('Accessing /admin/posts');
  if (!req.session.admin) {
    console.log('Not authenticated, redirecting to login');
    return res.redirect('/admin/login');
  }
  
  try {
    const posts = await readJSON(postsPath);
    console.log('Posts loaded:', posts.length);
    res.render('admin/posts', {
      title: '블로그 콘텐츠 관리',
      posts: Array.isArray(posts) ? posts.reverse() : []
    });
  } catch (error) {
    console.error('Error loading posts:', error);
    res.render('admin/posts', {
      title: '블로그 콘텐츠 관리',
      posts: []
    });
  }
});

app.get('/admin/posts/new', async (req, res) => {
  if (!req.session.admin) {
    return res.redirect('/admin/login');
  }
  
  res.render('admin/post-edit', {
    title: '새 글 작성'
  });
});

app.get('/admin/posts/:id/edit', async (req, res) => {
  if (!req.session.admin) {
    return res.redirect('/admin/login');
  }
  
  try {
    const posts = await readJSON(postsPath);
    const post = Array.isArray(posts) ? posts.find(p => p.id === req.params.id) : null;
    
    if (!post) {
      return res.status(404).render('404', { title: '404 - 페이지를 찾을 수 없습니다' });
    }
    
    res.render('admin/post-edit', {
      title: '글 수정',
      post: post
    });
  } catch (error) {
    console.error('Error loading post:', error);
    return res.status(404).render('404', { title: '404 - 페이지를 찾을 수 없습니다' });
  }
});

// 블로그 포스트 API
app.post('/api/posts', async (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  
  try {
    const { v4: uuidv4 } = require('uuid');
    let posts = [];
    try {
      posts = await readJSON(postsPath);
      if (!Array.isArray(posts)) posts = [];
    } catch (error) {
      posts = [];
    }
    
    const post = {
      id: uuidv4(),
      ...req.body,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    posts.push(post);
    await writeJSON(postsPath, posts);
    
    res.json({ success: true, post: post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  
  try {
    let posts = [];
    try {
      posts = await readJSON(postsPath);
      if (!Array.isArray(posts)) posts = [];
    } catch (error) {
      posts = [];
    }
    
    const postIndex = posts.findIndex(p => p.id === req.params.id);
    
    if (postIndex === -1) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    
    posts[postIndex] = {
      ...posts[postIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await writeJSON(postsPath, posts);
    
    res.json({ success: true, post: posts[postIndex] });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  
  try {
    let posts = [];
    try {
      posts = await readJSON(postsPath);
      if (!Array.isArray(posts)) posts = [];
    } catch (error) {
      posts = [];
    }
    
    const filteredPosts = posts.filter(p => p.id !== req.params.id);
    
    await writeJSON(postsPath, filteredPosts);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 후기 페이지 (서비스별)
app.get('/:service/reviews', async (req, res) => {
  const { service } = req.params;
  const serviceNames = {
    'julnoon': '줄눈시공',
    'move-in-cleaning': '입주청소',
    'elastic-coat': '탄성코트',
    'bathroom-remodeling': '화장실 리모델링'
  };
  
  if (!serviceNames[service]) {
    return res.status(404).render('404', { title: '404 - 페이지를 찾을 수 없습니다' });
  }
  
  const reviews = await readJSON(reviewsPath);
  const serviceReviews = reviews.filter(r => r.service === service && r.status === 'approved');
  
  res.render('reviews', {
    title: `${serviceNames[service]} 후기`,
    service: service,
    serviceName: serviceNames[service],
    reviews: serviceReviews
  });
});

// 지역별 페이지
app.get('/:region/:service?', async (req, res, next) => {
  const { region, service } = req.params;
  const regions = ['seoul', 'gyeonggi', 'incheon', 'busan'];
  const services = ['julnoon', 'move-in-cleaning', 'elastic-coat', 'bathroom-remodeling'];
  
  // 서비스 페이지인 경우 다음으로
  if (services.includes(region)) {
    return next();
  }
  
  if (regions.includes(region)) {
    if (service) {
      // 지역별 서비스 페이지
      const serviceNames = {
        'julnoon': '줄눈시공',
        'move-in-cleaning': '입주청소',
        'elastic-coat': '탄성코트',
        'bathroom-remodeling': '화장실 리모델링'
      };
      
      if (serviceNames[service]) {
        return res.render('region-service', {
          title: `${region} ${serviceNames[service]}`,
          region: region,
          service: service,
          serviceName: serviceNames[service]
        });
      }
    } else {
      // 지역 대표 페이지
      return res.render('region', {
        title: `${region} 전문 서비스`,
        region: region
      });
    }
  }
  
  next();
});

// 서비스 페이지 (마지막에)
app.get('/:service', async (req, res) => {
  const { service } = req.params;
  const serviceNames = {
    'julnoon': '줄눈시공',
    'move-in-cleaning': '입주청소',
    'elastic-coat': '탄성코트',
    'bathroom-remodeling': '화장실 리모델링'
  };
  
  if (!serviceNames[service]) {
    return res.status(404).render('404', { title: '404 - 페이지를 찾을 수 없습니다' });
  }
  
  const reviews = await readJSON(reviewsPath);
  const serviceReviews = reviews.filter(r => r.service === service && r.status === 'approved').slice(0, 5);
  
  res.render('service', {
    title: serviceNames[service],
    service: service,
    serviceName: serviceNames[service],
    reviews: serviceReviews
  });
});

// 예약 API
app.post('/api/reservation', async (req, res) => {
  try {
    const { v4: uuidv4 } = require('uuid');
    const reservations = await readJSON(reservationsPath);
    const settings = await readJSON(settingsPath);
    
    const reservation = {
      id: uuidv4(),
      ...req.body,
      status: 'pending',
      depositStatus: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // 견적 계산
    const estimate = calculateEstimate(req.body, settings);
    reservation.estimate = estimate;
    reservation.depositAmount = Math.floor(estimate.finalPrice * 0.3);
    
    reservations.push(reservation);
    await writeJSON(reservationsPath, reservations);
    
    res.json({ success: true, reservationId: reservation.id, estimate });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 견적 계산 함수
function calculateEstimate(data, settings) {
  const { service, serviceType, area, addServices } = data;
  let totalPrice = 0;
  const breakdown = [];
  
  // 메인 서비스
  const mainPrice = settings.pricing[service][serviceType] * (area || 1);
  totalPrice += mainPrice;
  breakdown.push({
    name: getServiceName(service),
    type: serviceType === 'basic' ? '기본' : '프리미엄',
    price: mainPrice
  });
  
  // 추가 서비스
  if (addServices && Array.isArray(addServices)) {
    addServices.forEach(addService => {
      const addPrice = settings.pricing[addService].basic * (area || 1);
      totalPrice += addPrice;
      breakdown.push({
        name: getServiceName(addService),
        type: '추가 서비스',
        price: addPrice
      });
    });
  }
  
  // 할인 계산
  const totalServices = 1 + (addServices ? addServices.length : 0);
  let discountRate = 0;
  if (totalServices >= 3) {
    discountRate = settings.discounts.package3;
  } else if (totalServices >= 2) {
    discountRate = settings.discounts.package2;
  }
  
  const discountAmount = Math.floor(totalPrice * discountRate);
  const finalPrice = totalPrice - discountAmount;
  
  return {
    subtotal: totalPrice,
    discount: { rate: discountRate, amount: discountAmount },
    finalPrice: finalPrice,
    breakdown: breakdown
  };
}

function getServiceName(service) {
  const names = {
    'julnoon': '줄눈시공',
    'move-in-cleaning': '입주청소',
    'elastic-coat': '탄성코트',
    'bathroom-remodeling': '화장실 리모델링'
  };
  return names[service] || service;
}

// 404 페이지 (모든 라우트 마지막에)
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - 페이지를 찾을 수 없습니다' });
});

// API 라우트 (관리자)
app.post('/api/review/approve/:id', async (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ success: false });
  }
  
  try {
    const reviews = await readJSON(reviewsPath);
    const review = reviews.find(r => r.id === req.params.id);
    if (review) {
      review.status = 'approved';
      review.approvedAt = new Date().toISOString();
      await writeJSON(reviewsPath, reviews);
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 서버 시작
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    console.log(`홈페이지: http://localhost:${PORT}`);
    console.log(`관리자 페이지: http://localhost:${PORT}/admin/login`);
  });
});

