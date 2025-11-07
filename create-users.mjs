import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read .env file
const envContent = readFileSync('.env', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const demoAccounts = [
  {
    email: 'superadmin@decarbonize.world',
    password: 'Demo123!@#',
    name: 'Super Administrator',
    role: 'superadmin'
  },
  {
    email: 'admin@decarbonize.world',
    password: 'Demo123!@#',
    name: 'Platform Admin',
    role: 'admin'
  },
  {
    email: 'webadmin@decarbonize.world',
    password: 'Demo123!@#',
    name: 'Web Admin',
    role: 'web_admin'
  },
  {
    email: 'user@decarbonize.world',
    password: 'Demo123!@#',
    name: 'Regular User',
    role: 'user'
  },
  {
    email: 'advisor@decarbonize.world',
    password: 'Demo123!@#',
    name: 'Investment Advisor',
    role: 'advisor'
  },
  {
    email: 'verification@decarbonize.world',
    password: 'Demo123!@#',
    name: 'Carbon Verification Org',
    role: 'verifier'
  },
  {
    email: 'ngo@decarbonize.world',
    password: 'Demo123!@#',
    name: 'Green Future Foundation',
    role: 'ngo'
  },
  {
    email: 'provider@decarbonize.world',
    password: 'Demo123!@#',
    name: 'EcoCarbon Solutions',
    role: 'carbon_provider'
  },
  {
    email: 'institutional@decarbonize.world',
    password: 'Demo123!@#',
    name: 'Global Investment Fund',
    role: 'institutional_investor'
  },
  {
    email: 'proinvestor@decarbonize.world',
    password: 'Demo123!@#',
    name: 'Pro Investor',
    role: 'pro_investor'
  },
  {
    email: 'freeinvestor@decarbonize.world',
    password: 'Demo123!@#',
    name: 'Free Investor',
    role: 'free_investor'
  }
];

async function createAuthUsers() {
  console.log('🚀 Starting to create demo auth users...\n');
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const account of demoAccounts) {
    try {
      console.log(`Creating ${account.email}...`);

      const { data, error } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: {
          data: {
            name: account.name,
            role: account.role
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          console.log(`⚠️  ${account.email} already exists - SKIPPING\n`);
          skipCount++;
        } else {
          console.error(`❌ Failed to create ${account.email}:`, error.message, '\n');
          errorCount++;
        }
      } else if (data.user) {
        console.log(`✅ Created: ${account.email}`);
        console.log(`   ID: ${data.user.id}`);
        console.log(`   Role: ${account.role}\n`);
        successCount++;

        // Try to update public.users with the correct auth ID
        try {
          const { error: updateError } = await supabase
            .from('users')
            .update({ id: data.user.id })
            .eq('email', account.email);

          if (!updateError) {
            console.log(`   ✅ Updated public.users ID\n`);
          }
        } catch (updateErr) {
          console.log(`   ⚠️  Could not update public.users ID\n`);
        }
      }

      // Wait between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`❌ Error creating ${account.email}:`, err.message, '\n');
      errorCount++;
    }
  }

  console.log('═══════════════════════════════════════════');
  console.log('✨ Auth user creation process completed!');
  console.log('═══════════════════════════════════════════');
  console.log(`✅ Successfully created: ${successCount}`);
  console.log(`⚠️  Already existed: ${skipCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total processed: ${demoAccounts.length}`);
  console.log('═══════════════════════════════════════════\n');

  if (successCount > 0 || skipCount > 0) {
    console.log('🎉 You can now login with these accounts:');
    console.log('\n📧 Email: admin@decarbonize.world');
    console.log('🔑 Password: Demo123!@#');
    console.log('👤 Role: Admin\n');

    console.log('📧 Email: advisor@decarbonize.world');
    console.log('🔑 Password: Demo123!@#');
    console.log('👤 Role: Advisor\n');

    console.log('📧 Email: verification@decarbonize.world');
    console.log('🔑 Password: Demo123!@#');
    console.log('👤 Role: Verifier\n');

    console.log('... and all other accounts in the list!\n');
  }

  console.log('📋 Next steps:');
  console.log('1. Open the app in your browser');
  console.log('2. Click Logout if you are logged in');
  console.log('3. Login with any of the demo accounts');
  console.log('4. Test the role-based dashboards');
  console.log('5. Test logout functionality\n');
}

createAuthUsers()
  .then(() => {
    console.log('✅ Script completed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Script failed:', err);
    process.exit(1);
  });
