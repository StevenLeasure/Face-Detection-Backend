const handleRegister = (db, bcrypt) => (req, res) => {
	const {email, name, password} = req.body;

	console.log('Registration attempt:', { email, name, password: password ? '***' : 'missing' });

	if (!email || !name || !password) {
    console.log('Missing fields');
    return res.status(400).json('incorrect form submission');
  	}
	const hash = bcrypt.hashSync(password);
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0].email,
					name: name,
					joined: new Date()
				}).then(user => {
					res.json(user[0]);
				})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
	.catch(err => res.status(400).json('unable to register'))
}

module.exports = {
	handleRegister: handleRegister
}