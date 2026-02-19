import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthProvider";
import { getBookmarks, toggleBookmark } from "../services/bookmarkService";
import { generateBlogPosts } from "../data/blogData";
import { FiBookmark, FiArrowLeft, FiLoader } from "react-icons/fi";
import { toast } from "react-hot-toast";

const SavedInsights = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [savedPosts, setSavedPosts] = useState([]);
    const allPosts = generateBlogPosts();

    useEffect(() => {
        const fetchSavedPosts = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                const bookmarkIds = await getBookmarks(currentUser.uid);
                // Filter posts that are in the bookmarkIds array
                const filtered = allPosts.filter(post => bookmarkIds.includes(post.id));
                setSavedPosts(filtered);
            } catch (error) {
                console.error("Error fetching saved insights:", error);
                toast.error("Failed to load saved insights");
            } finally {
                setLoading(false);
            }
        };

        fetchSavedPosts();
    }, [currentUser]);

    const handleRemoveBookmark = async (e, blogId) => {
        e.stopPropagation();
        if (!currentUser) return;

        try {
            await toggleBookmark(currentUser.uid, blogId);
            setSavedPosts(prev => prev.filter(post => post.id !== blogId));
            toast.success("Removed from bookmarks");
        } catch (error) {
            console.error("Error removing bookmark:", error);
            toast.error("Failed to remove bookmark");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent text-white">
                <FiLoader className="animate-spin text-4xl text-[var(--primary-color)]" />
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-[var(--text-main)] p-4">
                <h2 className="text-2xl font-bold mb-4">Please log in to view saved insights</h2>
                <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:brightness-110 transition-all"
                >
                    Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent text-[var(--text-main)] p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-[var(--text-muted)] hover:text-[var(--text-main)] mb-4 transition-colors"
                    >
                        <FiArrowLeft className="mr-2" /> Back
                    </button>
                    <div className="flex items-center gap-3">
                        <FiBookmark className="text-3xl text-[var(--primary-color)]" />
                        <h1 className="text-3xl font-bold">Saved Insights</h1>
                    </div>
                    <p className="text-[var(--text-muted)] mt-2">
                        You have {savedPosts.length} saved article{savedPosts.length !== 1 ? 's' : ''}
                    </p>
                </header>

                {savedPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-[var(--dashboard-bg-elevated)] rounded-2xl border border-[var(--border-color)]">
                        <FiBookmark className="text-6xl text-[var(--text-muted)] mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No saved insights yet</h3>
                        <p className="text-[var(--text-muted)] mb-6">Bookmark articles to read them later</p>
                        <button
                            onClick={() => navigate("/blog")}
                            className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:brightness-110 transition-all"
                        >
                            Browse Insights
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedPosts.map((post) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-[var(--dashboard-bg-card)] rounded-xl overflow-hidden border border-[var(--border-color)] hover:border-[var(--primary-color)] transition-all group cursor-pointer"
                                onClick={() => navigate(`/blog/${post.id}`)}
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <button
                                            onClick={(e) => handleRemoveBookmark(e, post.id)}
                                            className="p-2 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-red-500 transition-colors"
                                            title="Remove from saved"
                                            aria-label="Remove from saved"
                                        >
                                            <FiBookmark className="fill-current" />
                                        </button>
                                    </div>
                                    <div className="absolute top-3 left-3">
                                        <span
                                            className="px-3 py-1 text-xs font-medium rounded-full text-white"
                                            style={{ background: post.badgeColor || "#4559DC" }}
                                        >
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-3 text-sm text-[var(--text-muted)]">
                                        <span>{post.date}</span>
                                        <span>•</span>
                                        <span>{post.readTime}</span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-[var(--primary-color)] transition-colors text-[var(--text-main)]">
                                        {post.title}
                                    </h3>

                                    <p className="text-[var(--text-muted)] text-sm line-clamp-3 mb-4">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center text-[var(--primary-color)] text-sm font-medium">
                                        Read Article
                                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedInsights;
