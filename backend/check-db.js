import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MasteryPath from './models/MasteryPath.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sourishschemug_db_user:a4r1UIXNpZe16pRA@neuroprep-db.4lhua3l.mongodb.net/?appName=NeuroPrep-DB';

async function checkDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');
    
    const paths = await MasteryPath.find({});
    console.log(`\n📊 Found ${paths.length} mastery paths in database:\n`);
    
    paths.forEach((path, index) => {
      console.log(`${index + 1}. ${path.icon} ${path.title}`);
      console.log(`   Description: ${path.description.substring(0, 80)}...`);
      console.log(`   Companies: ${path.companyTags.join(', ')}`);
      console.log('');
    });
    
    await mongoose.disconnect();
    console.log('✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkDB();
