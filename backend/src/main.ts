import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ===== OWASP Security Configuration =====
  
  // Increase body size limit for image uploads
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  
  // Security Headers Middleware
  app.use((req, res, next) => {
    // Prevent clickjacking attacks
    res.setHeader('X-Frame-Options', 'DENY');
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Enable XSS filter in browsers
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Control referrer information
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Strict Transport Security - force HTTPS
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    // Remove server identification
    res.removeHeader('X-Powered-By');
    // Cache control for API responses
    if (req.path.includes('/api/')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
    }
    next();
  });
  
  app.setGlobalPrefix('api');
  
  // Global validation with security options
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true,
    forbidNonWhitelisted: true, // Reject unknown properties
    forbidUnknownValues: true,
  }));
  
  // CORS Configuration - restrict in production
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'https://witty-mushroom-0d3c50600.3.azurestaticapps.net',
    'http://localhost:5173',
    'http://localhost:3000',
  ];
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400, // 24 hours
  });

  // Swagger - disable in production for security
  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('SVS Stock API')
      .setDescription('Stock Management System API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application running on port ${port}`);
  console.log(`Security headers enabled`);
  console.log(`CORS restricted to: ${allowedOrigins.join(', ')}`);
}
bootstrap();
// OWASP Security Update: ${new Date().toISOString()}
