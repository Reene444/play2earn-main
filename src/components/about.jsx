import React from "react";
import SectionSvg from "../components/ui/SectionSvg";
import brackets from "../components/ui/Brackets";
import Header from "./header";
import Footer from "./footer";

// Integrated TagLine component
const TagLine = ({ className, children }) => (
  <div className={`tagline flex items-center ${className || ""}`}>
    {brackets("left")}
    <div className="mx-3 text-n-3">{children}</div>
    {brackets("right")}
  </div>
);

// Integrated Heading component
const Heading = ({ className, title, text, tag }) => (
  <div className={`${className} max-w-5xl mx-auto mb-12 lg:mb-20 text-center`}>
    {tag && <TagLine className="mb-4">{tag}</TagLine>}
    {title && <h2 className="text-5xl font-bold">{title}</h2>}
    {text && <p className="mt-4 text-white">{text}</p>}
  </div>
);

// Integrated Section component
const Section = ({
  className,
  id,
  crosses,
  crossesOffset,
  customPaddings,
  children,
}) => (
  <section
    id={id}
    className={`relative ${customPaddings || "py-10 lg:py-20"} ${
      className || ""
    }`}
    style={{ backgroundColor: "inherit" }} // Ensure background color is not altered
  >
    {children}
    {crosses && (
      <>
        <SectionSvg crossesOffset={crossesOffset} />
      </>
    )}
  </section>
);

// Main About component
const About = () => (
  <>
    <Header />
    <Section className="bg-white">
      <div className="container mx-auto text-gray-800 px-4">
        <Heading title="About Us" />

        <p className="text-gray-800 mb-14 text-justify">
          At Play2earn, we are dedicated to transforming the micro-engagement
          landscape through our extensive expertise and broad user base. Our
          goal is to build a dynamic, decentralized network where people from
          around the world, regardless of their crypto knowledge, can engage in
          meaningful interactions to support business growth. We aspire to
          create a globally connected community, where every interaction fuels
          the expansion of a thriving digital economy.
        </p>

        <div className="relative bg-white mb-10 rounded-3xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1">
              <img
                className="w-full h-full object-cover"
                alt="Illustration of cryptocurrency"
                src="/assets/crypto.png"
              />
            </div>
            <div className="flex-1 p-6 lg:p-12 bg-sky-200">
              <h4 className="text-gray-800 text-xl lg:text-2xl font-bold mb-4">
                Our Mission
              </h4>
              <p className="text-gray-800 text-base lg:text-lg">
                At Play2Earn.ai, our mission is to create a platform where
                gaming and AI development work hand in hand, rewarding players
                for their time, skill, and contributions to AI advancements.
                We’re building an ecosystem where gameplay fuels AI evolution,
                ensuring that everyone benefits from the intersection of play
                and purpose. Through this innovative approach, we’re empowering
                players to actively shape the future of technology while earning
                rewards in a mutually beneficial environment.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="border border-n-1/10 rounded-3xl p-8 bg-sky-100">
            <h4 className="text-gray-800 text-2xl font-bold mb-4">
              What we do
            </h4>
            <p className="text-gray-800 text-justify">
              At Play2Earn.ai, we are creating a platform where gaming and AI
              development work hand in hand, rewarding players for their time,
              skill, and contributions to AI advancements. We’re building an
              ecosystem where gameplay fuels AI evolution, ensuring that
              everyone benefits from the intersection of play and purpose.
              Through this innovative approach, we’re empowering players to
              actively shape the future of technology while earning rewards in a
              mutually beneficial environment.
            </p>
          </div>
          <div className="border border-n-1/10 rounded-3xl p-8 bg-sky-100">
            <h4 className="text-gray-800 text-2xl font-bold mb-4">
              Our Vision
            </h4>
            <p className="text-gray-800 text-justify">
              At Play2Earn.ai, we envision a world where gaming goes beyond
              entertainment to become a catalyst for technological advancement
              and personal growth. Our goal is to make gaming a meaningful
              experience that contributes to AI and digital innovation while
              providing real-world rewards. By blending immersive gameplay with
              cutting-edge technology, we aim to build a global community that
              shapes the future of technology and fosters collaboration through
              play.
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 mb-10">
          <div className="relative bg-sky-300 rounded-3xl overflow-hidden">
            <div className="p-8 bg-gradient-to-b from-sky-200 to-sky-300">
              <h4 className="text-gray-800 text-2xl font-bold mb-4">
                Start earning from Anywhere
              </h4>
              <p className="text-gray-800 text-justify">
                Earn rewards from anywhere! Work remotely and engage in tasks at
                your convenience, enjoying the freedom to make the most of your
                time while earning valuable rewards.
              </p>
              <img
                className="w-full h-auto object-cover mt-4"
                alt="Global engagement"
                src="/assets/global1.png"
              />
            </div>
          </div>

          <div className="relative bg-gradient-to-b from-sky-200 to-sky-300 rounded-3xl overflow-hidden">
            <div className="p-8">
              <h4 className="text-gray-800 text-2xl font-bold mb-4">
                Task Rewards
              </h4>
              <p className="text-gray-800 text-justify">
                Complete micro tasks and earn rewards effortlessly! Enjoy quick,
                easy tasks that fit your schedule, turning small efforts into
                valuable rewards.
              </p>
            </div>
            <img
              alt="Reward"
              src="/assets/reward1.png"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        <div className="bg-sky-200 rounded-xl overflow-hidden p-4 lg:p-12 mb-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col items-center bg-white rounded-lg p-6 shadow-lg border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                Total Users
              </h4>
              <h4 className="text-2xl font-bold text-gray-800">100k+</h4>
            </div>
            <div className="flex flex-col items-center bg-white rounded-lg p-6 shadow-lg border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                Completed Tasks
              </h4>
              <h4 className="text-2xl font-bold text-gray-800">100k+</h4>
            </div>
            <div className="flex flex-col items-center bg-white rounded-lg p-6 shadow-lg border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                Total Paid Out
              </h4>
              <h4 className="text-2xl font-bold text-gray-800">100k+</h4>
            </div>
          </div>
        </div>

        <div className="bg-sky-200 rounded-3xl overflow-hidden py-16 px-8 mb-5 mx-auto max-w-screen-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Our Roadmap
          </h2>
          <p className="text-gray-800 mb-8 text-center">
            Check out our journey and future plans as we continue to innovate
            and expand. Our roadmap outlines the key milestones and upcoming
            features that will shape the future of Play2earn.
          </p>
          <div className="flex flex-col md:flex-row md:flex-wrap justify-between gap-8">
            <div className="bg-blue-100 border border-gray-300 rounded-lg p-6 shadow-lg text-center flex flex-col justify-between flex-grow min-w-[200px] md:min-w-0">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                Q1 2024
              </h4>
              <p className="text-gray-600">
                Launch of our new task types and expanded crypto educational
                resources.
              </p>
            </div>
            <div className="bg-blue-100 border border-gray-300 rounded-lg p-6 shadow-lg text-center flex flex-col justify-between flex-grow min-w-[200px] md:min-w-0">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                Q2 2024
              </h4>
              <p className="text-gray-600">
                Expansion into new markets and enhancement of user experience
                with personalized features.
              </p>
            </div>
            <div className="bg-blue-100 border border-gray-300 rounded-lg p-6 shadow-lg text-center flex flex-col justify-between flex-grow min-w-[200px] md:min-w-0">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                Q3 2024
              </h4>
              <p className="text-gray-600">
                Integration of advanced analytics tools and introduction of new
                reward categories.
              </p>
            </div>
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg text-center ring-2 ring-white ring-offset-2 ring-offset-sky-200 flex flex-col justify-between flex-grow min-w-[200px] md:min-w-0">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                Q4 2024
              </h4>
              <p className="text-gray-600">
                Explore new technologies and expanding our platform's
                capabilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
    <Footer />
  </>
);

export default About;
