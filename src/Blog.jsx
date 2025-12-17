import React from 'react';
// Only Link is needed for internal navigation. Header is provided by Layout.
import { Calendar, User as AuthorIcon, ArrowRight } from 'lucide-react';

const Blog = () => {
  // Dummy Blog Data
  const posts = [
    {
      id: 1,
      title: "The 10 Best Foods for a Healthy Heart",
      excerpt: "Discover the top foods you should be eating to maintain a healthy cardiovascular system. From leafy greens to berries, learn how to fuel your heart naturally.",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=600&auto=format&fit=crop",
      date: "May 15, 2024",
      author: "Admin"
    },
    {
      id: 2,
      title: "Organic Vegetables: Why They Matter for Your Health",
      excerpt: "Understanding the difference between organic and non-organic farming can significantly impact your diet. Learn about the benefits of choosing organic produce.",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=600&auto=format&fit=crop",
      date: "May 12, 2024",
      author: "Dr. Smith"
    },
    {
      id: 3,
      title: "5 Quick Breakfast Ideas for Busy Mornings",
      excerpt: "Start your day right with these nutritious and fast breakfast recipes that take less than 10 minutes to prepare. Perfect for those on-the-go mornings.",
      image: "https://images.unsplash.com/photo-1533089862017-5c321805443c?q=80&w=600&auto=format&fit=crop",
      date: "May 10, 2024",
      author: "Chef Rose"
    },
    {
      id: 4,
      title: "Seasonal Fruits Guide: What to Eat When",
      excerpt: "Eating seasonal fruits is not only delicious but also more nutritious and often more affordable. Explore our guide to what's in season each month.",
      image: "https://images.unsplash.com/photo-1596769949938-1a5c6020721c?q=80&w=600&auto=format&fit=crop",
      date: "May 08, 2024",
      author: "Admin"
    },
    {
      id: 5,
      title: "The Benefits of Drinking More Water Daily",
      excerpt: "Hydration is key to good health. Learn about the many benefits of increasing your daily water intake and simple tips to help you drink more.",
      image: "https://images.unsplash.com/photo-1523307613524-74720e5e01b6?q=80&w=600&auto=format&fit=crop",
      date: "May 05, 2024",
      author: "Nutrition Expert"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-700">
      
      {/* Blog Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Latest News & Articles</h1>
            <p className="text-gray-500 mt-2">Tips and tricks for a healthier lifestyle, delicious recipes, and more!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
                <div key={post.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition duration-300">
                    <div className="h-56 overflow-hidden">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                            <span className="flex items-center gap-1"><AuthorIcon size={12} /> {post.author}</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-3 hover:text-[#2bbef9] cursor-pointer leading-tight">{post.title}</h2>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                        <button className="text-[#233a95] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">READ MORE <ArrowRight size={16} /></button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;