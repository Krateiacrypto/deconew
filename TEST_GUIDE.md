# Kapsamlı Test Rehberi - Decarbonize Platform

## Test Öncesi Hazırlık

### Demo Kullanıcılar
Tüm kullanıcılar için test senaryoları hazırlanmıştır. Demo hesaplar için `DEMO_ACCOUNTS.md` dosyasına bakın.

---

## 1. AUTHENTICATION & SESSION TESTLERI

### Test 1.1: Login İşlemi
**Roller:** Tüm roller (superadmin, admin, user, advisor, verifier, ngo, carbon_provider)

**Adımlar:**
1. `/login` sayfasına gidin
2. Demo hesap bilgileri ile giriş yapın
3. "Giriş başarılı!" mesajını doğrulayın
4. Dashboard'a yönlendirildiğini kontrol edin
5. Header'da kullanıcı adının göründüğünü doğrulayın

**Beklenen Sonuç:** ✅ Başarılı giriş, doğru dashboard, kullanıcı bilgileri görünür

### Test 1.2: Logout İşlemi
**Roller:** Tüm roller

**Adımlar:**
1. Herhangi bir kullanıcı ile giriş yapın
2. Header'daki kullanıcı menüsüne tıklayın
3. "Çıkış Yap" butonuna tıklayın
4. Loading spinner görünüyor mu?
5. "Çıkış yapıldı" mesajını doğrulayın
6. `/login` sayfasına yönlendirildiğini kontrol edin
7. Browser back butonuna basın - giriş sayfasında kalmalı

**Beklenen Sonuç:** ✅ Başarılı çıkış, session temizlendi, geri dönüşte korumalı sayfalara erişim yok

### Test 1.3: Session Persistence
**Roller:** Tüm roller

**Adımlar:**
1. Herhangi bir kullanıcı ile giriş yapın
2. Sayfayı yenileyin (F5)
3. Kullanıcı bilgilerinin kaybolmadığını kontrol edin
4. Farklı bir sekme açın ve aynı URL'e gidin
5. Her iki sekmede de giriş durumunu kontrol edin

**Beklenen Sonuç:** ✅ Session korundu, bilgiler kaybolmadı

### Test 1.4: Session Timeout & Invalid Token
**Roller:** Tüm roller

**Adımlar:**
1. Giriş yapın
2. Browser Developer Tools > Application > Local Storage > auth-storage sil
3. Korumalı bir sayfaya gitmeye çalışın
4. Login sayfasına yönlendirildiğini kontrol edin

**Beklenen Sonuç:** ✅ Invalid session tespit edildi, login sayfasına yönlendirildi

---

## 2. SUPERADMIN TESTLERI

### Test 2.1: SuperAdmin Dashboard Access
**Rol:** superadmin

**Adımlar:**
1. SuperAdmin ile giriş yapın
2. `/dashboard` sayfasında SuperAdminDashboard göründüğünü doğrulayın
3. Sistem metrikleri görüntüleniyor mu?
4. "Kullanıcı Profilleri" linkine tıklayın
5. Tüm kullanıcıları görebildiğinizi doğrulayın

**Beklenen Sonuç:** ✅ SuperAdmin dashboard göründü, tüm metrikler yüklendi

### Test 2.2: User Profiles Page Navigation
**Rol:** superadmin

**Adımlar:**
1. `/admin/profiles` sayfasına gidin
2. Kullanıcı listesinin yüklendiğini doğrulayın
3. "Yenile" butonuna tıklayın
4. Loading spinner göründü mü?
5. Kullanıcılar yeniden yüklendi mi?
6. Arama çubuğuna "test" yazın
7. Filtreleme çalışıyor mu?
8. Rol filtresi değiştirin (örn: "admin")
9. Filtreleme çalışıyor mu?

**Beklenen Sonuç:** ✅ Sayfa yüklendi, yenileme çalıştı, filtreler çalışıyor

### Test 2.3: User Profile Switching (Kritik Test!)
**Rol:** superadmin

**Adımlar:**
1. `/admin/profiles` sayfasında bir kullanıcıya tıklayın
2. Detay modalı açıldı mı?
3. Modal'ı kapatın
4. Başka bir kullanıcıya tıklayın
5. **Önceki kullanıcının bilgileri görünüyor mu?** (BUG kontrolü)
6. Modal'da doğru kullanıcının bilgileri var mı?
7. Farklı tablar arasında geçiş yapın (Profil, İstatistikler, Aktivite, Ayarlar)
8. Her tab doğru datayı gösteriyor mu?

**Beklenen Sonuç:** ✅ Her kullanıcı için doğru bilgiler, önceki kullanıcı datası yok

### Test 2.4: User Management Page Access
**Rol:** superadmin

**Adımlar:**
1. `/admin/users` sayfasına gidin
2. "Yenile" butonuna tıklayın
3. Kullanıcılar yenilendi mi?
4. Bir kullanıcıyı düzenleyin (Edit butonu)
5. Rol değiştirin (örn: user -> advisor)
6. Kaydet
7. Değişiklik database'e yansıdı mı?
8. Sayfayı yenileyin - değişiklik kalıcı mı?

**Beklenen Sonuç:** ✅ CRUD operasyonları çalışıyor, değişiklikler kalıcı

### Test 2.5: Logout & Re-login as SuperAdmin
**Rol:** superadmin

**Adımlar:**
1. SuperAdmin ile `/admin/profiles` sayfasındasınız
2. Çıkış yapın
3. Tekrar superadmin ile giriş yapın
4. `/admin/profiles` sayfasına gidin
5. **Eski kullanıcı datası görünüyor mu?** (BUG kontrolü)
6. Fresh data yüklendi mi?

**Beklenen Sonuç:** ✅ Fresh data yüklendi, cache temizlendi

---

## 3. ADMIN TESTLERI

### Test 3.1: Admin Dashboard Access
**Rol:** admin

**Adımlar:**
1. Admin ile giriş yapın
2. `/dashboard` AdminDashboard göründü mü?
3. SuperAdmin menüleri görünmüyor değil mi?
4. `/admin/profiles` sayfasına erişmeye çalışın
5. **Erişim engellendi mi?** (Sadece superadmin erişebilmeli)

**Beklenen Sonuç:** ✅ Admin dashboard göründü, superadmin sayfalarına erişim yok

### Test 3.2: Admin User Management
**Rol:** admin

**Adımlar:**
1. `/admin/users` sayfasına gidin
2. Bir user'ı düzenleyebildiğinizi doğrulayın
3. Bir superadmin kullanıcıyı düzenlemeye çalışın
4. **Engellendi mi?** (Admin, superadmin'leri düzenleyemez)
5. Başka bir admin'i düzenlemeye çalışın
6. **Engellendi mi?** (Admin, admin'leri düzenleyemez)

**Beklenen Sonuç:** ✅ User'ları düzenleyebilir, admin/superadmin'leri düzenleyemez

---

## 4. USER (INVESTOR) TESTLERI

### Test 4.1: User Dashboard
**Rol:** user (free_investor / pro_investor / institutional_investor)

**Adımlar:**
1. User ile giriş yapın
2. `/dashboard` UserDashboard göründü mü?
3. Portfolio bilgileri göründü mü?
4. Admin menüleri görünmüyor değil mi?

**Beklenen Sonuç:** ✅ User dashboard göründü, admin erişimi yok

### Test 4.2: Portfolio Page
**Rol:** user

**Adımlar:**
1. `/portfolio` sayfasına gidin
2. Yatırımlar göründü mü?
3. Karbon kredileri göründü mü?

**Beklenen Sonuç:** ✅ Portfolio bilgileri göründü

---

## 5. ADVISOR TESTLERI

### Test 5.1: Advisor Dashboard
**Rol:** advisor

**Adımlar:**
1. Advisor ile giriş yapın
2. `/dashboard` AdvisorDashboard göründü mü?
3. Atanmış kullanıcılar göründü mü?

**Beklenen Sonuç:** ✅ Advisor dashboard ve assigned users göründü

---

## 6. VERIFIER TESTLERI

### Test 6.1: Verifier Dashboard
**Rol:** verifier

**Adımlar:**
1. Verifier ile giriş yapın
2. `/dashboard` VerificationDashboard göründü mü?
3. Doğrulama bekleyen projeler göründü mü?

**Beklenen Sonuç:** ✅ Verification queue göründü

---

## 7. NGO TESTLERI

### Test 7.1: NGO Dashboard
**Rol:** ngo

**Adımlar:**
1. NGO ile giriş yapın
2. `/dashboard` NGODashboard göründü mü?
3. Desteklenen projeler göründü mü?

**Beklenen Sonuç:** ✅ NGO dashboard göründü

---

## 8. CARBON PROVIDER TESTLERI

### Test 8.1: Provider Dashboard
**Rol:** carbon_provider

**Adımlar:**
1. Carbon Provider ile giriş yapın
2. `/dashboard` ProviderDashboard göründü mü?
3. Karbon kredisi üretim bilgileri göründü mü?

**Beklenen Sonuç:** ✅ Provider dashboard göründü

---

## 9. EDGE CASE TESTLERI

### Test 9.1: Rapid Page Switching
**Rol:** superadmin

**Adımlar:**
1. SuperAdmin ile giriş yapın
2. Hızlıca şu sayfalar arasında geçiş yapın:
   - /dashboard → /admin/profiles → /admin/users → /dashboard
3. Her sayfada doğru datanın yüklendiğini kontrol edin
4. **Lag veya eski data görünüyor mu?**

**Beklenen Sonuç:** ✅ Her sayfa fresh data ile yüklendi, lag yok

### Test 9.2: Multiple Tab Logout
**Rol:** Herhangi bir rol

**Adımlar:**
1. 2 farklı browser tab'inde aynı kullanıcı ile giriş yapın
2. 1. tab'de çıkış yapın
3. 2. tab'i refresh edin
4. **2. tab'de de çıkış yapıldı mı?**

**Beklenen Sonuç:** ✅ Her iki tab'de de session sonlandı

### Test 9.3: Browser Back Button After Logout
**Rol:** Herhangi bir rol

**Adımlar:**
1. Giriş yapın
2. `/admin/profiles` gibi korumalı bir sayfaya gidin
3. Çıkış yapın
4. Browser back butonuna basın
5. **Korumalı sayfaya erişebildiniz mi?**

**Beklenen Sonuç:** ✅ Korumalı sayfaya erişim yok, login'e yönlendirildi

### Test 9.4: Network Interruption
**Rol:** Herhangi bir rol

**Adımlar:**
1. Giriş yapın
2. Browser DevTools > Network > Offline
3. Bir sayfa değiştirmeye çalışın
4. Error handling doğru mu?
5. Network'ü açın
6. Sayfa yeniden yükleniyor mu?

**Beklenen Sonuç:** ✅ Network hatası yakalandı, recovery başarılı

### Test 9.5: Concurrent Data Updates
**Rol:** superadmin

**Adımlar:**
1. 2 farklı browser'da superadmin ile giriş yapın
2. 1. browser'da bir kullanıcıyı düzenleyin
3. 2. browser'da "Yenile" butonuna basın
4. **Değişiklik 2. browser'da görünüyor mu?**

**Beklenen Sonuç:** ✅ Fresh data çekildi, değişiklik görünür

---

## 10. PERFORMANCE TESTLERI

### Test 10.1: Page Load Time
**Adımlar:**
1. Browser DevTools > Network > Disable cache
2. Hard refresh (Ctrl + Shift + R)
3. Page load time < 3 saniye mi?

**Beklenen Sonuç:** ✅ Sayfa 3 saniye içinde yüklendi

### Test 10.2: Cache Effectiveness
**Adımlar:**
1. `/admin/profiles` sayfasına gidin (users yüklenir)
2. `/admin/users` sayfasına gidin (users cache'den gelir)
3. Network tab'de yeni users request var mı?

**Beklenen Sonuç:** ✅ Cache kullanıldı, gereksiz request yok

---

## 11. SECURITY TESTLERI

### Test 11.1: Direct URL Access (Unauthorized)
**Rol:** user (normal kullanıcı)

**Adımlar:**
1. User ile giriş yapın
2. Browser URL'ine direkt `/admin/profiles` yazın
3. **Erişim engellendi mi?**

**Beklenen Sonuç:** ✅ Erişim engellendi, dashboard'a yönlendirildi

### Test 11.2: Token Manipulation
**Adımlar:**
1. Giriş yapın
2. DevTools > Application > Local Storage
3. `auth-storage` değerini değiştirin
4. Sayfayı yenileyin
5. **Çıkış yapıldı mı veya session invalid mi?**

**Beklenen Sonuç:** ✅ Invalid session tespit edildi

---

## HATA RAPORLAMA

Her test için:
- ✅ Başarılı
- ❌ Başarısız
- ⚠️ Kısmen çalışıyor

Başarısız testlerde:
1. Hangi adımda hata oluştu?
2. Hata mesajı nedir?
3. Browser console'da hata var mı?
4. Network tab'de başarısız request var mı?

---

## TEST SONUÇLARI

### Yapılan Düzeltmeler:
1. ✅ authStore.ts - Logout mekanizması güçlendirildi
2. ✅ Header.tsx - Logout button loading state eklendi
3. ✅ dataStore.ts - Cache yönetimi optimize edildi
4. ✅ UserProfiles.tsx - Component lifecycle düzeltildi
5. ✅ UserManagement.tsx - Data fetching güvenilirliği artırıldı
6. ✅ ProtectedRoute.tsx - Session validation eklendi

### Kritik Testler:
- Test 1.2: Logout İşlemi
- Test 2.3: User Profile Switching
- Test 2.5: Logout & Re-login
- Test 9.1: Rapid Page Switching
- Test 9.3: Browser Back Button After Logout

Bu testleri öncelikli olarak çalıştırın!
