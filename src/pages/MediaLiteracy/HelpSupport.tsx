import { ArrowLeft, HelpCircle, MessageCircle, Book, Mail, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLocation } from "wouter";

export const HelpSupport = (): JSX.Element => {
  const [, setLocation] = useLocation();

  const helpSections = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics of using InfoShield",
      action: () => alert("Getting Started guide would open here")
    },
    {
      icon: MessageCircle,
      title: "Live Chat Support",
      description: "Chat with our support team",
      action: () => alert("Live chat would open here")
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email for detailed help",
      action: () => window.open('mailto:support@infoshield.com')
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      action: () => alert("Phone support: +44 20 7946 0958")
    }
  ];

  const faqs = [
    {
      question: "How does InfoShield detect misinformation?",
      answer: "InfoShield uses advanced AI algorithms and cross-references multiple trusted sources to analyze the credibility of media content. Our system checks for consistency, source reliability, and fact-checking databases."
    },
    {
      question: "Is my personal data safe with InfoShield?",
      answer: "Yes, we take privacy seriously. Your personal data is encrypted and stored securely. We never sell your data to third parties, and you can control your privacy settings at any time."
    },
    {
      question: "How can I report false information?",
      answer: "You can report suspicious content by using the 'Report' button on any analyzed content. Our team will review your report and take appropriate action within 24 hours."
    },
    {
      question: "Can I use InfoShield on multiple devices?",
      answer: "Yes, your InfoShield account works across all devices. Simply log in with the same credentials on any device to access your personalized experience."
    },
    {
      question: "How do I improve my media literacy score?",
      answer: "Engage with our educational content, complete quizzes, participate in discussions, and regularly use our fact-checking tools. The more you interact with verified information, the higher your score becomes."
    },
    {
      question: "What should I do if the app isn't working properly?",
      answer: "First, try refreshing the app or restarting your device. If problems persist, check your internet connection and ensure you have the latest version of the app. Contact support if issues continue."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center gap-3">
          <Button onClick={() => setLocation('/profile-settings')} variant="ghost" size="sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-inter font-bold text-xl text-[#2D3A8C] dark:text-white">Help & Support</h1>
        </div>
      </div>

      <main className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
        {/* Support Options */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-[#2D3A8C] dark:text-blue-400" />
              <h2 className="font-inter font-bold text-xl text-gray-900 dark:text-white">How can we help you?</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Choose from the options below to get the help you need.
            </p>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {helpSections.map((section, index) => (
                <Button
                  key={index}
                  onClick={section.action}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 bg-[#2D3A8C]/10 dark:bg-blue-400/20 rounded-lg flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-[#2D3A8C] dark:text-blue-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 dark:text-white">{section.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{section.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#2D3A8C] dark:text-blue-400" />
              <h2 className="font-inter font-bold text-xl text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-gray-200 dark:border-gray-700">
                  <AccordionTrigger className="text-left text-gray-900 dark:text-white hover:text-[#2D3A8C] dark:hover:text-blue-400">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <h3 className="font-inter font-bold text-lg text-gray-900 dark:text-white mb-4">Still need help?</h3>
            
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong className="text-gray-900 dark:text-white">Email:</strong> support@infoshield.com
              </p>
              <p>
                <strong className="text-gray-900 dark:text-white">Phone:</strong> +44 20 7946 0958
              </p>
              <p>
                <strong className="text-gray-900 dark:text-white">Hours:</strong> Monday - Friday, 9 AM - 6 PM GMT
              </p>
              <p>
                <strong className="text-gray-900 dark:text-white">Response Time:</strong> We typically respond within 24 hours
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};