# 🚀 DECARBONIZE Platform - Test Rehberi

## ✅ Son Güncelleme: 2025-10-05

---

## 🔑 Demo Kullanıcı Hesapları

### **Tüm Kullanıcılar İçin Şifre:** `testuser`

| Email | Role | KYC | Tier | Açıklama |
|-------|------|-----|------|----------|
| superadmin@decarbonize.world | Super Admin | Level 3 | - | Sistem yönetimi |
| admin@decarbonize.world | Admin | Level 2 | - | Platform yönetimi |
| institutional@decarbonize.world | Institutional | Level 3 | Institutional | Kurumsal yatırımcı |
| proinvestor@decarbonize.world | Pro Investor | Level 2 | Pro | Pro yatırımcı |
| freeinvestor@decarbonize.world | Free Investor | Level 1 | Free | Temel yatırımcı |

---

## ✅ Düzeltilen Hatalar

### 1. **Logout Sorunu - ÇÖZÜLDÜ** ✅
- Problem: Çıkış butonuna tıklama çalışmıyordu
- Çözüm: `useNavigate` eklendi, logout sonrası `/` sayfasına yönlendirme yapılıyor
- Test: Profil menüsünden "Çıkış Yap" tıklandığında ana sayfaya yönlendiriliyor

### 2. **Kullanıcı Listesi Boş - ÇÖZÜLDÜ** ✅
- Problem: Kullanıcı yönetimi sayfasında kullanıcılar görünmüyordu
- Çözüm: `dataStore.fetchUsers()` fonksiyonu tüm alanları çekecek şekilde güncellendi
- Test: 10 demo kullanıcı başarıyla görüntüleniyor

---

## 🧪 Test Senaryoları

### Test 1: Logout Fonksiyonu
1. Herhangi bir kullanıcı ile login yapın
2. Sağ üst köşede kullanıcı adına tıklayın
3. "Çıkış Yap" butonuna tıklayın
4. ✅ Ana sayfaya yönlendirilmeli
5. ✅ Oturum kapanmalı

### Test 2: Kullanıcı Yönetimi
1. Admin ile login yapın (admin@decarbonize.world / testuser)
2. Sol menüden "Kullanıcı Yönetimi" seçin
3. ✅ 10 kullanıcı listelenm eli
4. ✅ Her kullanıcıda şunlar görünmeli:
   - Role badge (renkli)
   - KYC status
   - Tier badge (yatırımcılar için)
   - Organization bilgisi

### Test 3: Filtreleme
1. Role filter: "Pro Investor" seçin → 1 kullanıcı
2. KYC filter: "Approved" seçin → 10 kullanıcı
3. Search: "Investment" → 2 kullanıcı

---

## 📊 Database Kontrolü

```sql
-- Kullanıcıları listele
SELECT name, email, role, kyc_status, investor_tier
FROM public.users
WHERE email LIKE '%@decarbonize.world'
ORDER BY created_at DESC;
```

**Beklenen:** 10 kullanıcı

---

## 🚀 Geliştirme

```bash
# Build
npm run build

# Preview
npm run preview
```

---

**Status:** ✅ Ready for Testing
**Build:** ✅ Successful
**Last Updated:** 2025-10-05
