const About = () => {
  // Mock team data
  const teamMembers = [
    {
      id: 1,
      name: 'Dr. Jane Smith',
      role: 'Founder & CEO',
      bio: 'Dr. Smith has over 15 years of experience in educational technology and AI research.',
      image: 'https://via.placeholder.com/150?text=JS',
    },
    {
      id: 2,
      name: 'Prof. Michael Johnson',
      role: 'Chief Academic Officer',
      bio: 'Professor Johnson specializes in curriculum development and educational assessment.',
      image: 'https://via.placeholder.com/150?text=MJ',
    },
    {
      id: 3,
      name: 'Sarah Williams',
      role: 'Head of AI Development',
      bio: 'Sarah leads our AI team, focusing on creating intelligent educational tools.',
      image: 'https://via.placeholder.com/150?text=SW',
    },
    {
      id: 4,
      name: 'David Chen',
      role: 'UX/UI Director',
      bio: 'David ensures our platform provides an intuitive and engaging user experience.',
      image: 'https://via.placeholder.com/150?text=DC',
    },
  ];

  return (
    <div className="bg-white py-12 pt-24">
      <div className="container mx-auto px-4">
        {/* About Section */}
        <section className="mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">About ScroolPortal</h1>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-lg mb-6">
              ScroolPortal is an innovative AI-integrated educational platform designed to transform the way educational institutions operate. Our mission is to provide a seamless experience for students, teachers, department heads, and administrators through role-based access and intelligent features.
            </p>
            
            <p className="text-lg mb-6">
              Founded in 2023, ScroolPortal combines cutting-edge AI technology with educational expertise to create a platform that enhances learning outcomes, streamlines administrative tasks, and provides valuable insights through comprehensive analytics.
            </p>
            
            <p className="text-lg">
              Our team consists of educators, technologists, and AI specialists who are passionate about improving education through technology. We believe that by providing the right tools to all stakeholders in the educational ecosystem, we can help create more effective and engaging learning environments.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="card">
              <h2 className="text-2xl font-bold mb-4 text-primary">Our Mission</h2>
              <p className="text-lg">
                To empower educational institutions with AI-driven tools that enhance teaching, learning, and administration, making education more accessible, personalized, and effective for all stakeholders.
              </p>
            </div>
            
            <div className="card">
              <h2 className="text-2xl font-bold mb-4 text-primary">Our Vision</h2>
              <p className="text-lg">
                To be the leading provider of AI-integrated educational platforms, transforming how institutions operate and how knowledge is shared, ultimately improving educational outcomes worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map(member => (
              <div key={member.id} className="card text-center">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;