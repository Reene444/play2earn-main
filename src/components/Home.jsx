import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Trophy,
  Medal,
  Award,
  Crown,
  CircleDollarSign,
  UserPlus,
  Gamepad,
  CreditCard,
  Brain,
} from "lucide-react";
import { FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../App.css";
import { CustomPrevArrow, CustomNextArrow } from "./ui/CustomArrows";
import Leaderboard from "./leaderboard";
import TasksWeOffer from "./TasksWeOffer";
import Header from "./header";
import Footer from "./footer";

const Home = () => {
  const navigate = useNavigate();

  const taskTypes = useMemo(
    () => [
      {
        icon: Gamepad,
        title: "Play Games",
        description: "Choose from a variety of AI-enhanced games",
      },
      {
        icon: DollarSign,
        title: "Earn PlayCredits",
        description: "Earn credits based on your performance and achievements",
      },
      {
        icon: CreditCard,
        title: "Use PlayCredits",
        description:
          "Transfer credits to your PlayCreditCard for real-world use",
      },
      {
        icon: Brain,
        title: "Contribute to AI",
        description: "Your gameplay helps develop cutting-edge AI models",
      },
    ],
    []
  );

  const [heroCards] = useState([
    {
      title: "Stake.City",
      description:
        "A revolutionary platform where users stake, earn, and engage in location-based tasks. Seamlessly blending innovation and gamification, Stake.city empowers users to create, complete, and verify tasks while earning rewards, turning everyday actions into impactful opportunities.",
      image: "assets/stake.webp",
    },
    {
      title: "AI-Driven Games",
      description:
        "Our games are not just fun; they contribute to the development of cutting-edge AI models.",
      image: "assets/stake1.webp",
    },
    {
      title: "Global PlayCreditCard",
      description:
        "Use your PlayCredits in the real world, just like any other debit or credit card.",
      image: "assets/image6.png",
    },
  ]);

  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 700,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      nextArrow: <CustomNextArrow />,
      prevArrow: <CustomPrevArrow />,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
          },
        },
      ],
    }),
    []
  );

  const partnerLogos = useMemo(
    () => [
      "/assets/new4.png",
      "/assets/new2.png",
      "/assets/new3.png",
      "/assets/new1.png",
      "/assets/new5.png",
      "/assets/new6.png",
    ],
    []
  );

  const players = [
    {
      rank: 1,
      user: { name: "John Doe", profile: "john_doe" },
      points: 97.1238,
    },
    {
      rank: 2,
      user: { name: "Jane Smith", profile: "jane_smith" },
      points: 62.73737,
    },
    {
      rank: 3,
      user: { name: "Bob Johnson", profile: "bob_johnson" },
      points: 60.33707,
    },
    {
      rank: 4,
      user: { name: "Alice Brown", profile: "alice_brown" },
      points: 55.09825,
    },
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Crown className="h-6 w-6 text-amber-600" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      case 4:
        return <Medal className="h-6 w-6 text-grey-100" />;
      default:
        return null;
    }
  };

  const steps = [
    {
      icon: <UserPlus size={24} />,
      title: "Sign Up",
      description: "Create your account and join the Play2Earn ecosystem.",
      color: "bg-blue-100",
    },
    {
      icon: <Gamepad size={24} />,
      title: "Play Games",
      description:
        "Choose from a variety of AI-enhanced games and start playing.",
      color: "bg-blue-200",
    },
    {
      icon: <CircleDollarSign size={24} />,
      title: "Earn & Use PlayCredits",
      description: "Earn PlayCredits and use them with your PlayCreditCard.",
      color: "bg-blue-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          <Slider {...sliderSettings}>
            {heroCards.map((card, index) => (
              <div key={index} className="relative h-[300px] md:h-[500px]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${card.image})` }}
                />
                <div className="relative h-full flex flex-col justify-center items-center text-center text-white bg-black bg-opacity-50 p-4 md:p-8">
                  <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-white">
                    {card.title}
                  </h2>
                  <p className="text-base md:text-xl mb-4 md:mb-8">
                    {card.description}
                  </p>
                  <Button
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() =>
                      (window.location.href = "https://stake.city/")
                    }
                  >
                    Start Playing
                  </Button>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Tasks We Offer Section */}
      <TasksWeOffer />

      {/* Task Types Section */}
      <section className="py-10 md:py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            How It Works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {taskTypes.map((task, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg md:text-xl">
                      <task.icon className="mr-2 text-blue-500" />
                      {task.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm md:text-base">
                    {task.description}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            Feature Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {[
              {
                icon: Gamepad,
                title: "AI-Driven Games",
                description:
                  "Enjoy games that are not just fun but contribute to AI development.",
              },
              {
                icon: DollarSign,
                title: "Secure PlayCredit Wallet",
                description:
                  "Your earnings are stored in a secure wallet accessible anytime.",
              },
              {
                icon: CreditCard,
                title: "Global PlayCreditCard",
                description:
                  "Use your PlayCredits in the real world like any other card.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg md:text-xl">
                      <feature.icon className="mr-2 text-blue-500" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm md:text-base">
                    {feature.description}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section
        id="leaderboard"
        className="py-12 md:py-20 bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 ">
            Leaderboard
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {players.map((player, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-blue-600">
                      #{player.rank}
                    </CardTitle>
                    {getRankIcon(player.rank)}
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {player.user.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        @{player.user.profile}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-800">
                        PlayCredits Earned
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {player.points.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use Section */}
      <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-black mb-12">
            How to use Play2Earn.ai
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`${step.color} rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105`}
              >
                <div className="p-6">
                  <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-md">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-blue-700 text-center">
                    {step.description}
                  </p>
                </div>
                <div className="bg-blue-900 py-3 px-6">
                  <span className="text-white font-bold text-lg">
                    Step {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Companies Section */}
      <section className="py-10 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            Trusted by Brands You Know
          </h3>
          {/*fixed bug for icons*/}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-8 justify-items-center">
            {partnerLogos.map((logo, index) => (
              <motion.img
                key={index}
                src={logo}
                alt={`Partner ${index + 1}`}
                className="h-20 md:h-40 object-contain"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            ))}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-20 bg-blue-100">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">
            Ready to Start Earning?
          </h3>
          <p className="text-base md:text-xl mb-4 md:mb-8">
            Create your account today and dive into a world of AI-powered gaming
            opportunities.
          </p>
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => handleSignUpClick()}
          >
            Sign Up Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
