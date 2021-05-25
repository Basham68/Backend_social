const Posts = require('../models/postModels')

const Users = require('../models/userModel')



const postCtrl = {
    createPost:   async (req, res) => {
        try {
            
            const  content = req.body.content;
            if(!req.file) return res.status(400).json({msg : "Failed"})
            const images = req.file.filename;

            
           
            var newPost = new Posts({
           content , images , user: req.user._id 
        });
            
  
            await newPost.save()

            res.json({
                msg: 'Created Post!',
                newPost: {
                    ...newPost._doc,
                    user: req.user
                }
            })

     

            }   
            catch (err) {
                 return res.status(500).json({msg: err.message})
                    }
        },
        
        deletePost: async (req, res) => {
            try {
                const post = await Posts.findOneAndDelete({_id: req.params.id, user: req.user._id})
                if(!post) return res.status(400).json({msg : "Failed to delete"})
    
                res.json({
                    msg: 'Deleted Post!'
                   
                })
    
            } catch (err) {
                return res.status(500).json({msg: err.message})
            }
        }
    }
    

    
   


module.exports = postCtrl