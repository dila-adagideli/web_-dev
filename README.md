# Online Course Management System

Bu proje, NestJS backend ve React frontend ile geliştirilmiş bir Online Kurs Yönetim Sistemidir.

## Proje Yapısı

- `backend/` - NestJS backend uygulaması
- `frontend/` - React frontend uygulaması

## Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn
- MySQL (v8.0 veya üzeri)

## Kurulum ve Çalıştırma

### Veritabanı Kurulumu

1. MySQL'de yeni bir veritabanı oluşturun:

```sql
CREATE DATABASE course_management;
```

2. Backend dizininde `.env` dosyası oluşturun (opsiyonel):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=course_management
```

**Not:** Eğer `.env` dosyası oluşturmazsanız, varsayılan değerler kullanılacaktır.

### Backend

1. Backend dizinine gidin:

```bash
cd backend
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. Backend'i çalıştırın:

```bash
npm run start:dev
```

Backend varsayılan olarak `http://localhost:3001` adresinde çalışacaktır.

**Not:** Backend MySQL veritabanı kullanmaktadır ve TypeORM `synchronize: true` modunda çalışmaktadır (sadece development için). Veritabanı tabloları otomatik olarak oluşturulacaktır.

### Frontend

1. Yeni bir terminal açın ve frontend dizinine gidin:

```bash
cd frontend
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. Frontend'i çalıştırın:

```bash
npm start
```

Frontend varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

## Özellikler

### Authentication (Kimlik Doğrulama)

- Kullanıcı kaydı (Register)
- Kullanıcı girişi (Login)
- JWT token tabanlı yetkilendirme
- Rol bazlı erişim kontrolü (STUDENT, INSTRUCTOR)

### Entities (Varlıklar)

1. **User** - Kullanıcılar (STUDENT, INSTRUCTOR rolleri)
2. **Course** - Kurslar
3. **Lesson** - Dersler
4. **Category** - Kategoriler
5. **Enrollment** - Kayıtlar (Öğrenci-Kurs ilişkisi)

### İlişkiler

- **User → Course** (One-to-Many): Bir eğitmen birden fazla kurs oluşturabilir
- **Course → Lesson** (One-to-Many): Bir kurs birden fazla ders içerebilir
- **Course ↔ Category** (Many-to-Many): Bir kurs birden fazla kategoriye ait olabilir, bir kategori birden fazla kurs içerebilir
- **User ↔ Course** (Many-to-Many via Enrollment): Bir öğrenci birden fazla kursa kayıt olabilir, bir kurs birden fazla öğrenciye sahip olabilir

### CRUD İşlemleri

Tüm entity'ler için (Courses, Lessons, Categories) frontend üzerinden:

- Create (Oluşturma)
- Read (Okuma/Listeleme)
- Update (Güncelleme)
- Delete (Silme)

### Rol Bazlı Özellikler

**INSTRUCTOR (Eğitmen):**
- Kurs oluşturma, düzenleme ve silme
- Kurslarına ders ekleme ve silme
- Oluşturduğu kursları görüntüleme

**STUDENT (Öğrenci):**
- Tüm kursları görüntüleme
- Kurslara kayıt olma
- Kayıt olduğu kursları görüntüleme
- Kurs detaylarını ve dersleri görüntüleme

## Kullanım

1. Frontend'i açtığınızda login sayfası görünecektir
2. Yeni bir kullanıcı oluşturmak için "Kayıt Ol" linkine tıklayın
3. Kayıt sırasında rol seçimi yapabilirsiniz (STUDENT veya INSTRUCTOR)
4. Giriş yaptıktan sonra dashboard'a yönlendirileceksiniz
5. Dashboard'dan tüm kursları görüntüleyebilir, kayıt olduğunuz/oluşturduğunuz kursları görebilirsiniz
6. Eğitmenler yeni kurs oluşturabilir ve kurslarına ders ekleyebilir
7. Öğrenciler kurslara kayıt olabilir ve dersleri görüntüleyebilir

## API Endpoints

### Authentication

- `POST /auth/register` - Kullanıcı kaydı
- `POST /auth/login` - Kullanıcı girişi

### Courses

- `GET /courses` - Tüm kursları listele
- `GET /courses/:id` - Belirli bir kursu getir
- `POST /courses` - Yeni kurs oluştur (INSTRUCTOR)
- `PATCH /courses/:id` - Kursu güncelle (INSTRUCTOR)
- `DELETE /courses/:id` - Kursu sil (INSTRUCTOR)

### Lessons

- `GET /lessons` - Tüm dersleri listele
- `GET /lessons/:id` - Belirli bir dersi getir
- `GET /lessons/course/:courseId` - Bir kursa ait tüm dersleri getir
- `POST /lessons` - Yeni ders oluştur (INSTRUCTOR)
- `PATCH /lessons/:id` - Dersi güncelle (INSTRUCTOR)
- `DELETE /lessons/:id` - Dersi sil (INSTRUCTOR)

### Categories

- `GET /categories` - Tüm kategorileri listele
- `GET /categories/:id` - Belirli bir kategoriyi getir
- `POST /categories` - Yeni kategori oluştur
- `PATCH /categories/:id` - Kategoriyi güncelle
- `DELETE /categories/:id` - Kategoriyi sil

### Enrollments

- `GET /enrollments` - Tüm kayıtları listele
- `GET /enrollments/my-courses` - Kullanıcının kayıt olduğu kursları getir
- `POST /enrollments` - Kursa kayıt ol (STUDENT)
- `DELETE /enrollments/:id` - Kaydı iptal et

### Users

- `GET /users/profile` - Kullanıcı profil bilgilerini getir
- `GET /users` - Tüm kullanıcıları listele

**Not:** Tüm endpoint'ler (auth hariç) JWT token gerektirir. Bazı endpoint'ler belirli roller için kısıtlanmıştır.

## Veritabanı

Proje MySQL veritabanı kullanmaktadır. TypeORM `synchronize: true` modunda çalışmaktadır (sadece development için). Production ortamında migration kullanılmalıdır.

### Veritabanı Şeması

- **users** - Kullanıcı bilgileri
- **courses** - Kurs bilgileri
- **lessons** - Ders bilgileri
- **categories** - Kategori bilgileri
- **course_categories** - Kurs-Kategori ilişki tablosu (Many-to-Many)
- **enrollments** - Öğrenci-Kurs kayıt tablosu

## Teknolojiler

### Backend

- NestJS
- TypeORM
- MySQL
- JWT (JSON Web Tokens)
- Passport.js
- bcrypt
- class-validator
- class-transformer

### Frontend

- React 18
- React Router DOM
- Axios
- Context API (State Management)

## Proje Özellikleri

- Modern ve responsive tasarım
- Glassmorphism efektleri
- Animasyonlu UI elementleri
- Rol bazlı yetkilendirme
- JWT token tabanlı kimlik doğrulama
- RESTful API yapısı
- TypeORM ile veritabanı yönetimi

