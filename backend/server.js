const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;
const JWT_DEMO_TOKEN = 'hermeslink-demo-token';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

const now = () => new Date().toISOString();
const createId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const users = [
  {
    id: 'user_earth_control',
    name: 'Earth Control',
    email: 'control@hermeslink.space',
    password: '123456',
    role: 'control',
  },
  {
    id: 'user_commander',
    name: 'Commander Vega',
    email: 'crew@hermeslink.space',
    password: '123456',
    role: 'crew',
  },
];

let missionStatus = {
  id: 'mission_ares_1',
  name: 'ARES I',
  location: 'Mars Transit Vehicle',
  currentSol: 184,
  distanceFromEarthKm: 78200000,
  communicationDelayMinutes: 14,
  oxygen: 87,
  energy: 73,
  water: 68,
  hullIntegrity: 96,
  status: 'Nominal',
  updatedAt: now(),
};

let crewMembers = [
  {
    id: 'crew_ana',
    name: 'Ana Torres',
    role: 'Commander',
    bpm: 76,
    oxygenLevel: 98,
    stressLevel: 'Moderate',
    status: 'Active',
    lastCheck: now(),
  },
  {
    id: 'crew_lucas',
    name: 'Lucas Meyer',
    role: 'Engineer',
    bpm: 82,
    oxygenLevel: 97,
    stressLevel: 'Low',
    status: 'Active',
    lastCheck: now(),
  },
  {
    id: 'crew_maya',
    name: 'Maya Okafor',
    role: 'Medical Officer',
    bpm: 72,
    oxygenLevel: 99,
    stressLevel: 'Low',
    status: 'Active',
    lastCheck: now(),
  },
  {
    id: 'crew_noah',
    name: 'Noah Sato',
    role: 'Mission Specialist',
    bpm: 88,
    oxygenLevel: 96,
    stressLevel: 'High',
    status: 'Monitoring',
    lastCheck: now(),
  },
];

let tasks = [
  {
    id: 'task_001',
    title: 'Inspect solar array alignment',
    description: 'Validate panel angle after last course correction.',
    priority: 'high',
    status: 'in_progress',
    responsible: 'Lucas Meyer',
    source: 'Earth Control',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'task_002',
    title: 'Crew health check-in',
    description: 'Submit biometric and psychological status report.',
    priority: 'medium',
    status: 'pending',
    responsible: 'Maya Okafor',
    source: 'Earth Control',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'task_003',
    title: 'Update mission decision log',
    description: 'Register decisions taken during communication blackout.',
    priority: 'medium',
    status: 'pending',
    responsible: 'Ana Torres',
    source: 'Crew',
    createdAt: now(),
    updatedAt: now(),
  },
];

let alerts = [
  {
    id: 'alert_001',
    title: 'Communication delay elevated',
    message: 'Current one-way delay is simulated at 14 minutes.',
    severity: 'warning',
    acknowledged: false,
    createdAt: now(),
  },
];

let logs = [
  {
    id: 'log_001',
    type: 'decision',
    title: 'Manual navigation check approved',
    description: 'Crew approved manual verification during Earth signal delay.',
    createdBy: 'Ana Torres',
    createdAt: now(),
  },
];

let messages = [
  {
    id: 'msg_001',
    from: 'Earth Control',
    to: 'Crew',
    body: 'Confirm life support readings and solar array alignment.',
    priority: 'high',
    status: 'confirmed',
    simulatedDelaySeconds: 6,
    createdAt: now(),
    deliveredAt: now(),
    confirmedAt: now(),
  },
  {
    id: 'msg_002',
    from: 'Crew',
    to: 'Earth Control',
    body: 'Life support stable. Solar array inspection in progress.',
    priority: 'medium',
    status: 'delivered',
    simulatedDelaySeconds: 9,
    createdAt: now(),
    deliveredAt: now(),
    confirmedAt: null,
  },
];

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token || token !== JWT_DEMO_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized. Use the demo login endpoint first.' });
  }

  return next();
}

function addLog(type, title, description, createdBy = 'System') {
  const log = {
    id: createId('log'),
    type,
    title,
    description,
    createdBy,
    createdAt: now(),
  };

  logs.unshift(log);
  io.emit('logs:updated', logs);
  return log;
}

function simulateMessageDelivery(messageId) {
  const queuedMessage = messages.find((message) => message.id === messageId);
  if (!queuedMessage) return;

  setTimeout(() => {
    const message = messages.find((item) => item.id === messageId);
    if (!message) return;

    message.status = 'transmitting';
    io.emit('messages:updated', messages);
    io.emit('message:status', message);
  }, 1000);

  setTimeout(() => {
    const message = messages.find((item) => item.id === messageId);
    if (!message) return;

    const failed = Math.random() < 0.08;
    message.status = failed ? 'failed' : 'delivered';
    message.deliveredAt = failed ? null : now();

    io.emit('messages:updated', messages);
    io.emit('message:status', message);

    addLog(
      failed ? 'communication_failure' : 'communication_delivery',
      failed ? 'Message delivery failed' : 'Message delivered',
      failed
        ? `Message ${message.id} could not be delivered during the simulated Mars delay.`
        : `Message ${message.id} was delivered after ${message.simulatedDelaySeconds}s of simulated delay.`,
      'HermesLink Queue'
    );
  }, queuedMessage.simulatedDelaySeconds * 1000);
}

app.get('/', (_req, res) => {
  res.json({
    name: 'HermesLink API',
    status: 'online',
    description: 'Mission communication backend with REST API, Socket.IO and simulated Mars latency.',
    endpoints: ['/auth/login', '/mission/status', '/crew', '/tasks', '/messages', '/alerts', '/logs'],
  });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const { password: _password, ...safeUser } = user;

  return res.json({
    token: JWT_DEMO_TOKEN,
    user: safeUser,
  });
});

app.get('/mission/status', requireAuth, (_req, res) => {
  res.json(missionStatus);
});

app.patch('/mission/status', requireAuth, (req, res) => {
  missionStatus = {
    ...missionStatus,
    ...req.body,
    updatedAt: now(),
  };

  io.emit('mission:updated', missionStatus);
  addLog('mission_update', 'Mission status updated', 'Mission telemetry was updated from the API.', 'Earth Control');

  res.json(missionStatus);
});

app.get('/crew', requireAuth, (_req, res) => {
  res.json(crewMembers);
});

app.patch('/crew/:id', requireAuth, (req, res) => {
  const crewMember = crewMembers.find((member) => member.id === req.params.id);

  if (!crewMember) {
    return res.status(404).json({ error: 'Crew member not found' });
  }

  Object.assign(crewMember, req.body, { lastCheck: now() });
  io.emit('crew:updated', crewMembers);

  res.json(crewMember);
});

app.get('/tasks', requireAuth, (_req, res) => {
  res.json(tasks);
});

app.post('/tasks', requireAuth, (req, res) => {
  const task = {
    id: createId('task'),
    title: req.body.title || 'Untitled task',
    description: req.body.description || '',
    priority: req.body.priority || 'medium',
    status: req.body.status || 'pending',
    responsible: req.body.responsible || 'Unassigned',
    source: req.body.source || 'Earth Control',
    createdAt: now(),
    updatedAt: now(),
  };

  tasks.unshift(task);
  io.emit('tasks:updated', tasks);
  addLog('task_created', 'Task created', `New task created: ${task.title}`, task.source);

  res.status(201).json(task);
});

app.patch('/tasks/:id', requireAuth, (req, res) => {
  const task = tasks.find((item) => item.id === req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  Object.assign(task, req.body, { updatedAt: now() });
  io.emit('tasks:updated', tasks);
  addLog('task_updated', 'Task updated', `Task updated: ${task.title}`, req.body.updatedBy || 'Crew');

  res.json(task);
});

app.get('/messages', requireAuth, (_req, res) => {
  res.json(messages);
});

app.post('/messages', requireAuth, (req, res) => {
  const simulatedDelaySeconds = Number(req.body.simulatedDelaySeconds || Math.floor(Math.random() * 20) + 3);

  const message = {
    id: createId('msg'),
    from: req.body.from || 'Earth Control',
    to: req.body.to || 'Crew',
    body: req.body.body || '',
    priority: req.body.priority || 'medium',
    status: 'queued',
    simulatedDelaySeconds,
    createdAt: now(),
    deliveredAt: null,
    confirmedAt: null,
  };

  messages.unshift(message);
  io.emit('messages:updated', messages);
  io.emit('message:status', message);

  addLog(
    'communication_queued',
    'Message queued',
    `Message from ${message.from} to ${message.to} entered the latency queue.`,
    message.from
  );

  simulateMessageDelivery(message.id);

  res.status(201).json(message);
});

app.post('/messages/:id/confirm', requireAuth, (req, res) => {
  const message = messages.find((item) => item.id === req.params.id);

  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }

  message.status = 'confirmed';
  message.confirmedAt = now();

  io.emit('messages:updated', messages);
  io.emit('message:status', message);
  addLog('communication_confirmed', 'Message confirmed', `Message ${message.id} was confirmed.`, req.body.confirmedBy || 'Crew');

  res.json(message);
});

app.get('/alerts', requireAuth, (_req, res) => {
  res.json(alerts);
});

app.post('/alerts', requireAuth, (req, res) => {
  const alert = {
    id: createId('alert'),
    title: req.body.title || 'Mission alert',
    message: req.body.message || '',
    severity: req.body.severity || 'info',
    acknowledged: false,
    createdAt: now(),
  };

  alerts.unshift(alert);
  io.emit('alerts:updated', alerts);
  addLog('alert_created', 'Alert created', alert.title, req.body.createdBy || 'Earth Control');

  res.status(201).json(alert);
});

app.patch('/alerts/:id', requireAuth, (req, res) => {
  const alert = alerts.find((item) => item.id === req.params.id);

  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }

  Object.assign(alert, req.body);
  io.emit('alerts:updated', alerts);

  res.json(alert);
});

app.get('/logs', requireAuth, (_req, res) => {
  res.json(logs);
});

app.post('/logs', requireAuth, (req, res) => {
  const log = addLog(
    req.body.type || 'manual',
    req.body.title || 'Mission log',
    req.body.description || '',
    req.body.createdBy || 'Crew'
  );

  res.status(201).json(log);
});

io.on('connection', (socket) => {
  console.log('Dispositivo conectado ao DSN:', socket.id);

  socket.emit('mission:updated', missionStatus);
  socket.emit('crew:updated', crewMembers);
  socket.emit('tasks:updated', tasks);
  socket.emit('messages:updated', messages);
  socket.emit('alerts:updated', alerts);
  socket.emit('logs:updated', logs);

  socket.on('send_message', (data) => {
    const simulatedDelaySeconds = Number(data?.simulatedDelaySeconds || Math.floor(Math.random() * 20) + 3);

    const message = {
      id: createId('msg'),
      from: data?.from || 'Crew',
      to: data?.to || 'Earth Control',
      body: data?.body || data?.text || data?.message || '',
      priority: data?.priority || 'medium',
      status: 'queued',
      simulatedDelaySeconds,
      createdAt: now(),
      deliveredAt: null,
      confirmedAt: null,
    };

    messages.unshift(message);
    io.emit('messages:updated', messages);
    io.emit('receive_message', message);
    io.emit('message:status', message);
    simulateMessageDelivery(message.id);
  });

  socket.on('message:create', (payload = {}) => {
    const simulatedDelaySeconds = Number(payload.simulatedDelaySeconds || Math.floor(Math.random() * 20) + 3);

    const message = {
      id: createId('msg'),
      from: payload.from || 'Crew',
      to: payload.to || 'Earth Control',
      body: payload.body || payload.text || '',
      priority: payload.priority || 'medium',
      status: 'queued',
      simulatedDelaySeconds,
      createdAt: now(),
      deliveredAt: null,
      confirmedAt: null,
    };

    messages.unshift(message);
    io.emit('messages:updated', messages);
    io.emit('receive_message', message);
    io.emit('message:status', message);
    simulateMessageDelivery(message.id);
  });

  socket.on('disconnect', () => {
    console.log('Dispositivo desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`SERVIDOR HERMESLINK OPERANTE NA PORTA ${PORT}`);
  console.log(`HermesLink API running on http://localhost:${PORT}`);
  console.log('Demo logins: control@hermeslink.space / 123456 or crew@hermeslink.space / 123456');
});