import User from "../models/user.model.js"
import cryptoHash from 'crypto';

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find()
        if (!allUsers) {
        res.status(400).json({message: 'No users found in database'})
    }   else {
        res.status(200).json({message: 'Users found successfully', allUsers})
    }
    }   catch (error) {
        console.error('Error while getting all users:',error);
        res.status(500).json({message: error.messaage})
    }
}

export const getSingleUser = async (req, res) => {
    try {
        const userId = req.params.id
        const singleUser = await User.findById(userId)
        if (!singleUser) {
        res.status(400).json({message: `No user with such id:${userId} found`})
    }   else {
        res.status(200).json({message: 'User found successfully', singleUser})
    }
    }   catch (error) {
        console.error('Error while getting single user',error);
        res.status(500).json({message: error.messaage})
    }
}

export const deleteSingleUser = async (req, res) => {
    try {
        const userId = req.params.id
        const userToDelete = await User.findByIdAndDelete(userId)
        if (!userToDelete) {
            res.status(400).json({message: `No user with such id:${userId} found`})
        } else {
            res.status(200).json({message: 'User deleted successfully', userToDelete})
        }
    } catch (error) {
        console.error('Error while deleting user:',error);
        res.status(500).json({message: error.messaage})
    }
}

export const deleteAllUsers = async (req, res) => {
    try {
        const allUsers = await User.deleteMany()
        if (!allUsers) {
            res.status(400).json({message: 'No users found in database'})
        }   else {
            res.status(200).json({message: 'Users deleted successfully', allUsers})
        }
        }   catch (error) {
            console.error('Error while deleting all users:', error);
            res.status(500).json({message: error.messaage})
        }
}


export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { password, ...rest } = req.body;

    if (password) {
      const hashedPassword = cryptoHash.createHash('sha256').update(password).digest('hex');

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { ...rest, password: hashedPassword },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: `User with id: ${userId} not found` });
      }

      return res.status(200).json({ message: 'User updated successfully', updatedUser });
    } else {
      const updatedUser = await User.findByIdAndUpdate(userId, rest, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: `User with id: ${userId} not found` });
      }

      return res.status(200).json({ message: 'User updated successfully', updatedUser });
    }
  } catch (error) {
    console.error('Error while updating User:', error);
    res.status(400).json({ message: error.message });
  }
};

export const freezeAccount = async(req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            res.status(401).json({message: "You are unauthorized to freeze this account"})
        }
        user.isFrozen = true
        await user.save()
    } catch (error) {
        res.status(500).json({message:error})
    }
}

export const getSuggestedUsers = async (req, res) => {
	try {
		const userId = req.user._id;

		const usersFollowedByYou = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{
				$sample: { size: 10 },
			},
		]);
		const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const followAndUnfollow = async (req, res) => {
    try {
        const id = req.params.id
        const userToModify = await User.findById(id)
        const currentUser = await User.findById(req.user._id)

        if (id === req.user._id.toString()) {
            res.status(400).json({message: "You cannot follow/unfollow yourself"})
        }
        if (!userToModify || !currentUser) {
            res.status(404).json({message:'User not found'})
        }
        const isFollowing = currentUser.followers.includes(id)
        if (isFollowing) {
            // unfollow user
            await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}})
            await User.findByIdAndUpdate(req.user_id, {$pull: {following:id}})
            res.status(200).json({message: "You have successfully unfollowed this user"})
        } else {
            // follow user
            await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}})
            await User.findByIdAndUpdate(req.user_id,{$push:{following:id}})
            res.status(200).json({message: "You have successfully followed this user"})
        }
    } catch (error) {
        console.log();
        res.status(500).json(error.message)
    }
}

