# 🔐 Supabase Auth Kullanıcı Oluşturma Rehberi

## ⚠️ ÖNEMLİ SORUN

**Durum:** `public.users` tablosunda kullanıcı kayıtları var ANCAK `auth.users` tablosunda yok!

**Sonuç:** Sadece Supabase Auth'da kayıtlı kullanıcılar (muhtemelen sadece superadmin) giriş yapabiliyor.

**Çözüm:** Tüm demo kullanıcıları Supabase Auth'a kaydetmeniz gerekiyor.

---

## 🚀 Hızlı Çözüm: Supabase Dashboard'dan Kullanıcı Oluşturma

### Adım 1: Supabase Dashboard'a Gidin
1. Tarayıcınızda https://0ec90b57d6e95fcbda19832f.supabase.co açın
2. Authentication > Users sekmesine gidin

### Adım 2: Her Kullanıcıyı Oluşturun

Aşağıdaki kullanıcıları **tek tek** oluşturun:

#### 1. Super Admin (Zaten var olabilir)
- **Email:** `superadmin@decarbonize.world`
- **Password:** `Demo123!@#`
- ✅ **Auto Confirm User** seçeneğini işaretleyin
- "Create User" butonuna tıklayın

#### 2. Platform Admin
- **Email:** `admin@decarbonize.world`
- **Password:** `Demo123!@#`
- ✅ **Auto Confirm User** işaretli
- Create User

#### 3. Investment Advisor
- **Email:** `advisor@decarbonize.world`
- **Password:** `Demo123!@#`
- ✅ **Auto Confirm User** işaretli
- Create User

#### 4. Verifier
- **Email:** `verification@decarbonize.world`
- **Password:** `Demo123!@#`
- ✅ **Auto Confirm User** işaretli
- Create User

#### 5. NGO
- **Email:** `ngo@decarbonize.world`
- **Password:** `Demo123!@#`
- ✅ **Auto Confirm User** işaretli
- Create User

#### 6. Carbon Provider
- **Email:** `provider@decarbonize.world`
- **Password:** `Demo123!@#`
- ✅ **Auto Confirm User** işaretli
- Create User

#### 7. Institutional Investor
- **Email:** `institutional@decarbonize.world`
- **Password:** `Demo123!@#`
- ✅ **Auto Confirm User** işaretli
- Create User

#### 8. Pro Investor
- **Email:** `proinvestor@decarbonize.world`
- **Password:** `Demo123!@#`
- ✅ **Auto Confirm User** işaretli
- Create User

#### 9. Free Investor
- **Email:** `freeinvestor@decarbonize.world`
- **Password:** `Demo123!@#`
- ✅ **Auto Confirm User** işaretli
- Create User

### Adım 3: User ID'leri ile `public.users` Tablosunu Güncelle

Her kullanıcı oluşturulduktan sonra:

1. **Authentication > Users** sayfasında yeni oluşturulan kullanıcının **UID**'sini kopyalayın
2. **Table Editor > users** tablosuna gidin
3. İlgili email adresine sahip satırı bulun
4. `id` kolonunu Supabase Auth'dan kopyaladığınız UID ile değiştirin
5. Save/Update

**ÖRNEKlemme:**
```sql
-- Supabase SQL Editor'da çalıştırın
UPDATE public.users
SET id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'  -- Supabase Auth'dan UID
WHERE email = 'admin@decarbonize.world';
```

---

## 🔧 Alternatif: Platform Üzerinden Kayıt

Eğer Supabase Dashboard erişiminiz yoksa:

1. Platform'un Register sayfasına gidin: `/register`
2. Her kullanıcı için:
   - Email girin
   - Password girin: `Demo123!@#`
   - Ad Soyad girin
   - "Kayıt Ol" butonuna tıklayın
3. Giriş yapın
4. Superadmin ile profil bilgilerini tamamlayın

---

## ✅ Doğrulama

### Test 1: Login Testi
1. Logout yapın
2. Her kullanıcı ile tek tek giriş yapın:
   ```
   Email: admin@decarbonize.world
   Password: Demo123!@#
   ```
3. Başarılı giriş ✅
4. Dashboard doğru role göre görüntüleniyor mu? ✅
5. Çıkış yapabiliyor musunuz? ✅

### Test 2: Database Kontrolü

Supabase SQL Editor'da çalıştırın:

```sql
-- Auth.users kontrolü
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 15;

-- Public.users kontrolü
SELECT id, email, role, kyc_status
FROM public.users
ORDER BY created_at DESC
LIMIT 15;

-- ID match kontrolü
SELECT
  au.email as auth_email,
  pu.email as public_email,
  pu.role,
  CASE WHEN au.id = pu.id THEN 'MATCH ✅' ELSE 'MISMATCH ❌' END as id_status
FROM auth.users au
FULL OUTER JOIN public.users pu ON au.email = pu.email
WHERE au.email LIKE '%@decarbonize.world'
ORDER BY pu.role;
```

**Beklenen Sonuç:** Tüm kullanıcılar için "MATCH ✅"

---

## 🐛 Sorun Giderme

### Sorun 1: "Invalid login credentials"
**Neden:** Kullanıcı `auth.users` tablosunda yok
**Çözüm:** Supabase Dashboard'dan kullanıcıyı oluşturun

### Sorun 2: "Kullanıcı profili bulunamadı"
**Neden:** `auth.users`'daki ID ile `public.users`'daki ID eşleşmiyor
**Çözüm:** `public.users` tablosundaki ID'yi güncelleyin

### Sorun 3: Logout çalışmıyor
**Neden:** localStorage veya session cache
**Çözüm:**
1. Browser DevTools > Application > Local Storage > Hepsini sil
2. Browser DevTools > Application > Session Storage > Hepsini sil
3. Sayfayı hard refresh (Ctrl + Shift + R)
4. Tekrar logout deneyin

### Sorun 4: Çıkış sonrası loading sonsuz dönüyor
**Neden:** Kod düzeltmesi uygulandı, sayfayı yenileyin
**Çözüm:**
1. Browser cache temizle
2. `npm run build` çalıştırın
3. Development server'ı restart edin
4. Hard refresh (Ctrl + Shift + R)

---

## 📋 Kontrol Listesi

- [ ] Supabase Dashboard'a eriştim
- [ ] Authentication > Users sayfasındayım
- [ ] superadmin@decarbonize.world var
- [ ] admin@decarbonize.world oluşturuldu
- [ ] advisor@decarbonize.world oluşturuldu
- [ ] verification@decarbonize.world oluşturuldu
- [ ] ngo@decarbonize.world oluşturuldu
- [ ] provider@decarbonize.world oluşturuldu
- [ ] institutional@decarbonize.world oluşturuldu
- [ ] proinvestor@decarbonize.world oluşturuldu
- [ ] freeinvestor@decarbonize.world oluşturuldu
- [ ] Tüm ID'ler `public.users` ile eşleşiyor
- [ ] Her kullanıcı ile login test edildi
- [ ] Logout çalışıyor
- [ ] Dashboard doğru görüntüleniyor

---

## 🎯 Sonuç

Bu adımları tamamladıktan sonra:
- ✅ Tüm kullanıcılar giriş yapabilecek
- ✅ Logout düzgün çalışacak
- ✅ Role-based dashboards görüntülenecek
- ✅ Session management düzgün çalışacak

**Destek:** Sorun yaşarsanız console.log'lara bakın ve hata mesajlarını paylaşın.
