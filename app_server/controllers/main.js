exports.home = (req, res) => res.render('home', { title: 'Home' });
exports.intake = (req, res) => res.render('intake', { title: 'Case Intake' });
exports.dashboard = (req, res) => res.render('dashboard', { title: 'Dashboard' });
exports.reports = (req, res) => res.render('reports', { title: 'Reports' });
exports.settings = (req, res) => res.render('settings', { title: 'Settings' });
exports.login = (req, res) => res.render('login', { title: 'Login' });
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
}