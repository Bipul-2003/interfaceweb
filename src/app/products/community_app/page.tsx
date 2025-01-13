import { communityAppData } from "@/data/productData"

export default function CommunityApp() {
  const { title, description, status, features } = communityAppData

  return (
    <div className="bg-gradient-to-br from-purple-400 to-indigo-600 text-white py-20 px-4 min-h-screen flex justify-center items-center rounded-xl">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-5xl font-bold mb-6 animate-slide-down">{title}</h1>
        <p className="text-xl mb-12 animate-slide-up">{description}</p>

        <div className="bg-white text-gray-800 rounded-lg shadow-2xl p-8 mb-12 animate-fade-in">
          <h2 className="text-3xl font-semibold mb-4 text-indigo-600 ">{status}</h2>
          {/* <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-indigo-700">What to expect:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2 animate-slide-in" style={{animationDelay: `${index * 100}ms`}}>
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        {/* <div className="bg-indigo-800 rounded-lg shadow-2xl p-8 animate-fade-in">
          <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
          <p className="text-lg mb-6">Be the first to know when our Community App launches. Sign up for updates:</p>
          <form className="flex flex-col md:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              type="submit" 
              className="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Notify Me
            </button>
          </form>
        </div> */}
      </div>
    </div>
  )
}

