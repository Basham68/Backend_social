const Users = require('../models/userModel')


const user ={

    updateUser: async (req, res) => {
        try {
            const {  fullname,gender,address } = req.body
           const profilePictue = req.file.filename

            await Users.findByIdAndUpdate({_id: req.user._id}, {
                   fullname, address, gender,profilePictue
            })

            res.json({msg: "Update Success!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    follow: async (req, res) => {

        if (req.body.userId !== req.params.id) {
            try {
              const user = await Users.findById(req.params.id);
              const currentUser = await Users.findById(req.body.userId);
              if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("user has been followed");
              } else {
                res.status(403).json("You are already following this user");
              }
            } catch (err) {
              res.status(500).json(err);
            }
          } else {
            res.status(403).json("You cannot follow yourself");
          }
      
    },
        unfollow: async (req, res) => {
            if (req.body.userId !== req.params.id) {
                try {
                  const user = await Users.findById(req.params.id);
                  const currentUser = await Users.findById(req.body.userId);
                  if (user.followers.includes(req.body.userId)) {
                    await user.updateOne({ $pull: { followers: req.body.userId } });
                    await currentUser.updateOne({ $pull: { followings: req.params.id } });
                    res.status(200).json("user has been unfollowed");
                  } else {
                    res.status(403).json("you dont follow this user");
                  }
                } catch (err) {
                  res.status(500).json(err);
                }
              } else {
                res.status(403).json("you cannot unfollow yourself");
              }
        }
        
    
    

}

module.exports = user;