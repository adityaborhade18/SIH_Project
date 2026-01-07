import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // API call or email integration can be added here
        console.log(formData);
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <section className="w-full bg-gradient-to-b from-slate-50 to-white px-6 py-16 md:px-16">
            {/* Header */}
            <div className="mx-auto max-w-4xl text-center">
                <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                    Contact Us
                </h1>
                <p className="mt-4 text-base text-slate-600 md:text-lg">
                    Have a question, suggestion, or feedback? We’d love to hear from you.
                </p>
            </div>

            {/* Content */}
            <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
                {/* Contact Info */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-semibold text-slate-900">
                        Get in Touch
                    </h2>
                    <p className="text-slate-600">
                        Reach out to us for any support related to issue reporting, tracking,
                        or platform usage. Our team is here to help you.
                    </p>

                    <div className="space-y-4">
                        <InfoItem
                            icon={<Mail className="h-5 w-5 text-blue-600" />}
                            title="Email"
                            value="support@civicconnect.com"
                        />
                        <InfoItem
                            icon={<Phone className="h-5 w-5 text-green-600" />}
                            title="Phone"
                            value="+91 98765 43210"
                        />
                        <InfoItem
                            icon={<MapPin className="h-5 w-5 text-purple-600" />}
                            title="Address"
                            value="Municipal Technology Office, India"
                        />
                    </div>
                </div>

                {/* Contact Form */}
                <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                    <h3 className="mb-6 text-xl font-semibold text-slate-900">
                        Send a Message
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Message
                            </label>
                            <textarea
                                name="message"
                                rows="4"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                placeholder="Write your message here..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <Send className="h-4 w-4" />
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

function InfoItem({ icon, title, value }) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">{title}</p>
                <p className="text-sm text-slate-600">{value}</p>
            </div>
        </div>
    );
}
