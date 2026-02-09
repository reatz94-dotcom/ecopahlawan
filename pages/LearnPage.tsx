
import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateStreamingContentFromGemini, generateContentFromGemini, ensureApiKeySelected } from '../services/geminiService';
import { INITIAL_LEARNING_TOPICS } from '../constants';
import { LearningTopic, ChatMessage } from '../types';

const LearnPage: React.FC = () => {
  const [topics, setTopics] = useState<LearningTopic[]>(INITIAL_LEARNING_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userQuestion, setUserQuestion] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const fetchTopicContent = async (topicId: string) => {
    setIsLoadingContent(true);
    const isKeySelected = await ensureApiKeySelected();
    if (!isKeySelected) {
      alert('Gagal memuat konten. Harap pilih kunci API Anda.');
      setIsLoadingContent(false);
      return;
    }

    try {
      const topic = topics.find((t) => t.id === topicId);
      if (topic) {
        // Clear previous chat messages when a new topic is selected
        setChatMessages([]);
        const prompt = `Jelaskan secara singkat, menarik, dan mudah dipahami oleh siswa sekolah dasar tentang topik "${topic.title}". Berikan contoh konkret yang relevan. (maksimal 300 kata)`;
        const content = await generateContentFromGemini(prompt);
        setSelectedTopic({ ...topic, content });
      }
    } catch (error) {
      console.error('Failed to fetch topic content:', error);
      alert('Gagal memuat detail topik. Mohon coba lagi.');
      setSelectedTopic((prev) => (prev ? { ...prev, content: 'Gagal memuat konten.' } : null));
    } finally {
      setIsLoadingContent(false);
    }
  };

  const sendChatMessage = async () => {
    if (!userQuestion.trim() || !selectedTopic) return;

    const newUserMessage: ChatMessage = { id: Date.now().toString() + 'user', sender: 'user', text: userQuestion };
    setChatMessages((prev) => [...prev, newUserMessage]);
    setUserQuestion('');
    setIsLoadingChat(true);

    const isKeySelected = await ensureApiKeySelected();
    if (!isKeySelected) {
      setChatMessages((prev) => [...prev, { id: Date.now().toString() + 'gemini', sender: 'gemini', text: 'Gagal merespons. Harap pilih kunci API Anda.' }]);
      setIsLoadingChat(false);
      return;
    }

    const prompt = `Berdasarkan topik "${selectedTopic.title}" dan pertanyaan ini: "${newUserMessage.text}", jawablah dengan singkat dan jelas.`;
    const streamingBotMessage: ChatMessage = { id: Date.now().toString() + 'gemini', sender: 'gemini', text: '', isStreaming: true };
    setChatMessages((prev) => [...prev, streamingBotMessage]);

    generateStreamingContentFromGemini(
      prompt,
      (chunkText) => {
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingBotMessage.id ? { ...msg, text: msg.text + chunkText } : msg
          )
        );
      },
      () => {
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingBotMessage.id ? { ...msg, isStreaming: false } : msg
          )
        );
        setIsLoadingChat(false);
      },
      (errorText) => {
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingBotMessage.id ? { ...msg, text: errorText, isStreaming: false } : msg
          )
        );
        setIsLoadingChat(false);
      },
      chatMessages
    );
  };

  // Scroll to bottom of chat on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* List of Learning Topics */}
      <Card className="lg:col-span-1">
        <h2 className="text-2xl font-bold text-dark-blue mb-4">Topik Pembelajaran</h2>
        <ul className="space-y-3">
          {topics.map((topic) => (
            <li key={topic.id}>
              <button
                onClick={() => fetchTopicContent(topic.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors duration-200
                  ${selectedTopic?.id === topic.id ? 'bg-primary-green text-white shadow-md' : 'bg-light-gray hover:bg-medium-gray text-dark-blue'}
                  focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2`}
              >
                <h3 className="font-semibold text-lg">{topic.title}</h3>
                <p className="text-sm opacity-90">{topic.description}</p>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      {/* Selected Topic Content and Chat */}
      <Card className="lg:col-span-2">
        {selectedTopic ? (
          <>
            <h2 className="text-2xl font-bold text-dark-blue mb-4">{selectedTopic.title}</h2>
            {selectedTopic.image && (
              <img
                src={selectedTopic.image}
                alt={selectedTopic.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            {isLoadingContent ? (
              <LoadingSpinner />
            ) : (
              <div className="prose prose-sm max-w-none mb-6 text-gray-700">
                {selectedTopic.content ? (
                  <p className="leading-relaxed">{selectedTopic.content}</p>
                ) : (
                  <p>Pilih topik untuk melihat detailnya.</p>
                )}
              </div>
            )}

            {/* Chat Section */}
            <div className="border-t border-medium-gray pt-6 mt-6">
              <h3 className="text-xl font-bold text-primary-green mb-4">Tanya Gemini!</h3>
              <div ref={chatContainerRef} className="bg-light-gray p-4 rounded-lg h-64 overflow-y-auto mb-4 custom-scrollbar">
                {chatMessages.length === 0 && (
                  <p className="text-gray-500 text-center italic">
                    Ajukan pertanyaan tentang topik ini untuk memulai obrolan!
                  </p>
                )}
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-primary-green text-white'
                          : 'bg-white text-dark-blue shadow-sm'
                      }`}
                    >
                      {msg.text}
                      {msg.isStreaming && (
                        <span className="ml-2 inline-block animate-pulse text-xs">...</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow p-3 border border-medium-gray rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
                  placeholder="Ketik pertanyaanmu..."
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !isLoadingChat) {
                      sendChatMessage();
                    }
                  }}
                  disabled={isLoadingChat || isLoadingContent}
                />
                <Button onClick={sendChatMessage} disabled={isLoadingChat || isLoadingContent} className="rounded-l-none">
                  Kirim
                </Button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-center py-10">Pilih topik dari daftar di samping untuk memulai.</p>
        )}
      </Card>
    </div>
  );
};

export default LearnPage;
