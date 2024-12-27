
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white text-center py-3 fixed-bottom">
      <p className="mb-0">
        &copy; {currentYear} My Website. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
