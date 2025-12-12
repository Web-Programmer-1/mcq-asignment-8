
export default function AboutPage() {
  const teamMembers = [
    {
      name: "Rahim Ahmed",
      role: "Founder & Lead Developer",
      desc: "Full-stack developer with 8+ years building ed-tech platforms",
      img: "/team/rahim.jpg", 
    },
    {
      name: "Dr. Fatima Khan",
      role: "Education Advisor",
      desc: "Former BCS examiner & curriculum designer for competitive exams",
      img: "/team/fatima.jpg",
    },
    {
      name: "Ayesha Siddiqua",
      role: "UX/UI Designer",
      desc: "Passionate about creating intuitive learning experiences",
      img: "/team/ayesha.jpg",
    },
    {
      name: "Karim Hossain",
      role: "Data Analyst & ML Engineer",
      desc: "Specializes in MCQ pattern analysis using AI",
      img: "/team/karim.jpg",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-emerald-600 py-24 md:py-32">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative container mx-auto px-6 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold font-poppins mb-6">
              About MCQ Analysis BD
            </h1>
            <p className="text-lg md:text-xl font-roboto max-w-3xl mx-auto opacity-95">
              We are on a mission to transform how students prepare for competitive exams in Bangladesh
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-poppins mb-6">
                Our Mission
              </h2>
              <div className="w-24 h-1 bg-teal-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-mt-2 text-3xl font-semibold text-teal-700 mb-6">
                  “Empowering students through smart MCQ analysis”
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed font-roboto">
                  We believe success in competitive exams isn't just about hard work—it's about smart work. 
                  Our platform helps students identify weaknesses, improve accuracy, optimize time management, 
                  and ultimately succeed in BCS, Bank, University Admission, Medical, and other competitive exams.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-12 shadow-2xl text-white">
                  <svg className="w-24 h-24 mb-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-xl font-medium text-center">
                    Save 50% study time<br />with targeted practice
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-poppins mb-6">
                Our Story
              </h2>
              <div className="w-24 h-1 bg-teal-600 mx-auto rounded-full"></div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16 text-center md:text-left md:flex items-center gap-12">
              <div className="md:w-1/2">
                <p className="text-lg md:text-xl leading-relaxed text-gray-700 font-roboto">
                  Born out of the need for better performance tracking, <strong>MCQ Analysis BD</strong> was created by a team of educators and developers who deeply understand the struggles Bangladeshi students face in competitive exams.
                </p>
                <p className="mt-6 text-lg md:text-xl leading-relaxed text-gray-700 font-roboto">
                  What started as a simple tool to analyze mock test results has now grown into a powerful platform helping <span className="text-teal-600 font-bold">tens of thousands</span> of students streamline their preparation and achieve their dreams.
                </p>
                <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold text-teal-600">10K+</div>
                    <div className="text-gray-600">Active Students</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-teal-600">500K+</div>
                    <div className="text-gray-600">MCQs Analyzed</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-teal-600">95%</div>
                    <div className="text-gray-600">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-teal-600">4.9/5</div>
                    <div className="text-gray-600">User Rating</div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
                <div className="bg-gradient-to-tr from-teal-400 to-emerald-500 rounded-3xl w-80 h-80 shadow-2xl flex items-center justify-center">
                  <span className="text-white text-6xl font-bold rotate-12">2019 → 2025</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-poppins mb-6">
                Meet the Team
              </h2>
              <div className="w-24 h-1 bg-teal-600 mx-auto rounded-full"></div>
              <p className="mt-6 text-xl text-gray-600 font-roboto max-w-3xl mx-auto">
                Passionate educators and technologists working together to revolutionize exam preparation in Bangladesh
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
                >
                  <div className="p-8 text-center">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-xl">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 font-poppins">{member.name}</h3>
                    <p className="text-teal-600 font-medium mt-1">{member.role}</p>
                    <p className="mt-4 text-gray-600 text-sm leading-relaxed font-roboto">
                      {member.desc}
                    </p>
                  </div>
                  <div className="h-2 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="bg-teal-600 py-16">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white font-poppins mb-6">
              Ready to Transform Your Preparation?
            </h3>
            <button className="bg-white text-teal-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition shadow-lg">
              Get Started Free
            </button>
          </div>
        </section>
      </div>
    </>
  );
}