import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Video, Phone, Paperclip, Smile } from 'lucide-react';
import 'stream-chat-react/dist/css/v2/index.css';

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const initializeChat = async () => {
      const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
      
      try {
        // Connect user to Stream Chat
        await client.connectUser(
          {
            id: user.id,
            name: user.name,
            image: user.avatar || `https://getstream.io/random_png/?name=${user.name}`,
          },
          // In production, generate this token server-side
          client.devToken(user.id)
        );

        setChatClient(client);

        // Create or get support channel
        const supportChannel = client.channel('messaging', 'support', {
          name: 'Customer Support',
          members: [user.id, 'support-agent'],
        });

        await supportChannel.watch();
        setChannel(supportChannel);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();

    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to access the chat support system.
          </p>
        </div>
      </div>
    );
  }

  if (!chatClient || !channel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Connecting to Support
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we connect you to our support team...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          style={{ height: 'calc(100vh - 120px)' }}
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Customer Support</h1>
                  <p className="text-blue-100">We're here to help you!</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                  <Video className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="h-full">
            <Chat client={chatClient} theme="str-chat__theme-light">
              <div className="flex h-full">
                {/* Channel List - Hidden on mobile, shown on desktop */}
                <div className="hidden lg:block w-80 border-r border-gray-200 dark:border-gray-700">
                  <ChannelList
                    filters={{ members: { $in: [user.id] } }}
                    sort={{ last_message_at: -1 }}
                    options={{ state: true, presence: true, limit: 10 }}
                  />
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                  <Channel channel={channel}>
                    <Window>
                      <div className="flex-1 flex flex-col">
                        {/* Messages */}
                        <div className="flex-1 overflow-hidden">
                          <MessageList />
                        </div>

                        {/* Message Input */}
                        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                              <Paperclip className="h-5 w-5" />
                            </button>
                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                              <Smile className="h-5 w-5" />
                            </button>
                          </div>
                          <MessageInput />
                        </div>
                      </div>
                    </Window>
                    <Thread />
                  </Channel>
                </div>
              </div>
            </Chat>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Live Chat</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Get instant help from our support team
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Video Call</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Schedule a video call with our experts
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">FAQ</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Find answers to common questions
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage;