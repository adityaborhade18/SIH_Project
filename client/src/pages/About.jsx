import React from "react";
import { CheckCircle, MapPin, Bell, ShieldCheck, BarChart3 } from "lucide-react";

export default function About() {
    return (
        <section className="w-full bg-gradient-to-b from-slate-50 to-white px-6 py-16 md:px-16">
            {/* Header */}
            <div className="mx-auto max-w-5xl text-center">
                <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                    About the Civic Issue Reporting Platform
                </h1>
                <p className="mt-4 text-base text-slate-600 md:text-lg">
                    A smart and transparent platform designed to help citizens report, track, and resolve civic issues efficiently through a modern and user-friendly digital system.
                </p>
            </div>

            {/* Main Content */}
            <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2">
                {/* Left Content */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-slate-900">
                        Empowering Citizens, Improving Cities
                    </h2>
                    <p className="text-slate-600">
                        This platform allows citizens to actively participate in improving their
                        surroundings by reporting real-time civic issues such as road damage,
                        garbage overflow, water leakage, streetlight failures, and more.
                    </p>
                    <p className="text-slate-600">
                        Users can easily create issues, track their progress, receive updates,
                        and ensure accountability from concerned authorities — all from a single
                        dashboard.
                    </p>
                </div>

                {/* Right Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FeatureCard
                        icon={<MapPin className="h-6 w-6 text-blue-600" />}
                        title="Create Issues"
                        description="Report civic problems with location details, images, and clear descriptions."
                    />
                    <FeatureCard
                        icon={<BarChart3 className="h-6 w-6 text-green-600" />}
                        title="Track Progress"
                        description="Monitor issue status in real time from submission to resolution."
                    />
                    <FeatureCard
                        icon={<Bell className="h-6 w-6 text-orange-500" />}
                        title="Get Updates"
                        description="Receive notifications whenever the issue status is updated."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="h-6 w-6 text-purple-600" />}
                        title="Secure & Transparent"
                        description="Ensures data security, transparency, and accountability at every step."
                    />
                </div>
            </div>

            {/* Workflow Section */}
            <div className="mx-auto mt-20 max-w-6xl">
                <h2 className="mb-10 text-center text-2xl font-semibold text-slate-900">
                    How It Works
                </h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <StepCard step="1" text="Register or Login as a citizen" />
                    <StepCard step="2" text="Create and submit a civic issue" />
                    <StepCard step="3" text="Track status and receive updates" />
                    <StepCard step="4" text="Issue gets resolved by authorities" />
                </div>
            </div>

            {/* Footer Note */}
            <div className="mx-auto mt-20 max-w-4xl text-center">
                <p className="text-sm text-slate-500">
                    This platform focuses on improving civic engagement and urban governance by enabling transparent communication between citizens and concerned authorities.
                </p>
            </div>
        </section>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="mb-4 flex items-center gap-3">
                {icon}
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            </div>
            <p className="text-sm text-slate-600">{description}</p>
        </div>
    );
}

function StepCard({ step, text }) {
    return (
        <div className="flex flex-col items-center rounded-2xl bg-slate-50 p-6 text-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                {step}
            </div>
            <p className="text-sm text-slate-600">{text}</p>
        </div>
    );
}
