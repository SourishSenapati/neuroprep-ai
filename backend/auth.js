import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import { 
  createUser, 
  findUserByEmail, 
  findUserByGoogleId, 
  findUserByLinkedInId, 
  findUserByTwitterId,
  findUserById,
  updateUser,
  verifyPassword 
} from './database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'neuroprep-ai-secret-key';

// Passport configuration
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    
    if (!user.password_hash) {
      return done(null, false, { message: 'Please use social login' });
    }
    
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return done(null, false, { message: 'Invalid password' });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Google OAuth Strategy (only if configured)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await findUserByGoogleId(profile.id);
    
    if (!user) {
      // Check if user exists with same email
      user = await findUserByEmail(profile.emails[0].value);
      if (user) {
        // Link Google account to existing user
        await updateUser(user.id, { google_id: profile.id });
        user.google_id = profile.id;
      } else {
        // Create new user
        const userId = await createUser({
          email: profile.emails[0].value,
          google_id: profile.id,
          name: profile.displayName,
          avatar_url: profile.photos[0]?.value
        });
        user = { id: userId, email: profile.emails[0].value, name: profile.displayName };
      }
    }
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
  }));
}

// LinkedIn OAuth Strategy (only if configured)
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: "/api/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_liteprofile']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await findUserByLinkedInId(profile.id);
    
    if (!user) {
      user = await findUserByEmail(profile.emails[0].value);
      if (user) {
        await updateUser(user.id, { linkedin_id: profile.id });
        user.linkedin_id = profile.id;
      } else {
        const userId = await createUser({
          email: profile.emails[0].value,
          linkedin_id: profile.id,
          name: profile.displayName,
          avatar_url: profile.photos[0]?.value
        });
        user = { id: userId, email: profile.emails[0].value, name: profile.displayName };
      }
    }
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
  }));
}

// Twitter OAuth Strategy (only if configured)
if (process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_CONSUMER_SECRET) {
  passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: "/api/auth/twitter/callback"
}, async (token, tokenSecret, profile, done) => {
  try {
    let user = await findUserByTwitterId(profile.id);
    
    if (!user) {
      const userId = await createUser({
        twitter_id: profile.id,
        name: profile.displayName,
        avatar_url: profile.photos[0]?.value
      });
      user = { id: userId, name: profile.displayName };
    }
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
  }));
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// JWT token generation
export function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// JWT verification middleware
export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Auth routes
export function setupAuthRoutes(app) {
  // Local login
  app.post('/api/auth/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(401).json({ error: info.message });
      }
      
      const token = generateToken(user);
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar_url: user.avatar_url
        }
      });
    })(req, res, next);
  });
  
  // Register
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name, phone, role, level } = req.body;
      
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      const userId = await createUser({
        email,
        password,
        name,
        phone,
        role,
        level
      });
      
      const user = { id: userId, email, name };
      const token = generateToken(user);
      
      res.json({
        success: true,
        token,
        user
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Google OAuth
  app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  
  app.get('/api/auth/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
      const token = generateToken(req.user);
      res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
    }
  );
  
  // LinkedIn OAuth
  app.get('/api/auth/linkedin',
    passport.authenticate('linkedin')
  );
  
  app.get('/api/auth/linkedin/callback',
    passport.authenticate('linkedin', { session: false }),
    (req, res) => {
      const token = generateToken(req.user);
      res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
    }
  );
  
  // Twitter OAuth
  app.get('/api/auth/twitter',
    passport.authenticate('twitter')
  );
  
  app.get('/api/auth/twitter/callback',
    passport.authenticate('twitter', { session: false }),
    (req, res) => {
      const token = generateToken(req.user);
      res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
    }
  );
  
  // Get current user
  app.get('/api/auth/me', verifyToken, (req, res) => {
    res.json({ user: req.user });
  });
  
  // Logout
  app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true });
  });
}

export default passport;