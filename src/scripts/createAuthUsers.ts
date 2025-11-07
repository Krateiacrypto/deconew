import { supabase } from '../lib/supabase';

const demoAccounts = [
  {
    email: 'admin@decarbonize.world',
    password: 'Demo123!@#',
    name: 'Platform Admin',
    role: 'admin'
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
          },
          emailRedirectTo: undefined
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`⚠️  ${account.email} already exists - SKIPPING`);
        } else {
          console.error(`❌ Failed to create ${account.email}:`, error.message);
        }
      } else if (data.user) {
        console.log(`✅ Created: ${account.email} (ID: ${data.user.id})`);

        // Update the public.users table with the correct auth ID
        const { error: updateError } = await supabase
          .from('users')
          .update({ id: data.user.id })
          .eq('email', account.email);

        if (updateError) {
          console.log(`⚠️  Could not update public.users ID for ${account.email}`);
        } else {
          console.log(`✅ Updated public.users ID for ${account.email}`);
        }
      }

      // Wait a bit between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err: any) {
      console.error(`❌ Error creating ${account.email}:`, err.message);
    }
  }

  console.log('\n✨ Auth user creation process completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Test login with each account');
  console.log('2. Verify role-based dashboards');
  console.log('3. Test logout functionality');
}

createAuthUsers().catch(console.error);
