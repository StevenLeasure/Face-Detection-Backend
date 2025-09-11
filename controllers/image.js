// const Clarifai = require('clarifai');

// const returnClarifaiRequestOptions = (imageUrl) => {
//   // Your PAT (Personal Access Token) can be found in the Account's Security section
//   const PAT = 'f994193246d54eff9d623415ba286671';
//   // Specify the correct user_id/app_id pairings
//   // Since you're making inferences outside your app's scope
//   const USER_ID = 'steven_leasure';
//   const APP_ID = 'main';
//   // Change these to whatever model and image URL you want to use
//   const MODEL_ID = 'face-detection';
//   const IMAGE_URL = imageUrl;

const handleImage = (supabase) => (req, res) => {
	const {id} = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0].entries);
	})
	.catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImage: handleImage
}