const jwt = require ('jsonwebtoken')
const {nanoid} = require ('nanoid')
const admin = require('firebase-admin')
const serviceaccount = require ('./gymguru-firebase-adminsdk-m6i0r-3ed2c60191.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceaccount)
})

const PostProfile = async (req,res) => {
    const image = req.body.image
    const {name, gender, age, weight, height} = req.body;
    const token = req.headers.authorization;
    
    if (!image || !name || !gender || !age || !weight || !height) {
        return res.status(400).json({error: true, message: 'Please enter your data as shown.'});
    }
    try {
        const decodedToken = await admin.auth().verifyIdToken(token)
        const userId = decodedToken.uid

        const profile = {
            userId, image, name, gender, age, weight, height
        }

        pool.query(
            'INSERT INTO profile (userId, image, name, gender, age, weight, height) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, image, name, gender, age, weight, height],
            (error) => {
              if (error) {
                console.error('Error inserting profile:', error);
                return res.status(500).json({ error: true, message: 'An error occurred while creating the profile.' });
              }
      
              res.status(201).json({error : false, data : profile});
            }
          );
    }
    catch (error) {
        return req.status(401).json({error:true, message: 'invalid token'});
    }
};

const getProfile = async(req,res) => {
    const {token} = req.body

    try{
        const decodedToken = await admin.auth().verifyIdToken(token)
        const userId = decodedToken.uid
    
        pool.query('SELECT * FROM profile where userId = ?',
        [userId],
        (error, results) => {
          if (error) {
            console.error('Error retrieving profile list:', error)
            return res.status(500).json({ error: true, message: 'An error while retrieving profile'})
          }
          if (results.length === 0){
            return res.status(404).json({error: true, message: 'No profile yes.'})
          }
    
          res.status(200).json({error: false, message: 'Profile retrieved', profile: results})
        }
        )
      }
      catch(error) {
        return res.status(401).json({ error: true, message: 'invalid token Id'})
      }
}

const editProfile = async (req, res) => {
    const image = req.body.image
    const {name, gender, age, weight, height} = req.body;
    const token = req.headers.authorization
  
    try {
        const decodedToken = await admin.auth().verifyIdToken(token)
        const userId = decodedToken.uid
  
      if (!name && !gender && !age && !weight && !height ) {
        return res.status(400).json({ error: true, message: 'Please provide at least one field to update (name, gender, age, weight, height).' })
      }
  
      let updateFields = []
      let queryParams = []
      
      if (name) {
        updateFields.push('name = ?')
        queryParams.push(name)
      }
  
      if (gender) {
        updateFields.push('gender = ?')
        queryParams.push(gender)
      }
  
      if (age) {
        updateFields.push('age = ?')
        queryParams.push(age)
      }

      if (height) {
        updateFields.push('height = ?')
        queryParams.push(height)
      }

      if (weight) {
        updateFields.push('weight = ?')
        queryParams.push(weight)
      }
  
      updateFields.push('updated = ?')
      queryParams.push(new Date())
  
      queryParams.push(id)
      queryParams.push(userId)
  
      pool.query(
        `UPDATE notes SET ${updateFields.join(', ')} WHERE id = ? AND userId = ?`,
        queryParams,
        (error, results) => {
          if (error) {
            console.error('Error updating profile:', error);
            return res.status(500).json({ error: true, message: 'An error occurred while updating the profile.' });
          }
  
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: true, message: 'Note not found or not authorized to update.' });
          }
  
          const updatedProfile = {
            userId,
            image,
            name,
            gender,
            age,
            height,
            weight,
          }
  
          res.status(200).json(updatedProfile);
        }
      )
    } catch (error) {
      return res.status(401).json({ error: true, message: 'Invalid token' });
    }
  }

module.export = {
    PostProfile,
    getProfile,
    editProfile
}