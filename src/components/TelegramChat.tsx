import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from '@/hooks/useTranslation';
import { DatabaseService, DatabaseMessage, DatabaseChannel } from '@/services/database';
import { 
  Send, 
  Hash, 
  Users, 
  Pin, 
  Search,
  Phone,
  Video,
  MoreVertical,
  Smile
} from 'lucide-react';

interface TelegramChatProps {
  currentUserId: string;
  channels: DatabaseChannel[];
}

export const TelegramChat: React.FC<TelegramChatProps> = ({ 
  currentUserId, 
  channels 
}) => {
  const { t } = useTranslation();
  const [selectedChannel, setSelectedChannel] = useState<DatabaseChannel | null>(channels[0] || null);
  const [messages, setMessages] = useState<DatabaseMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChannel) {
      loadMessages(selectedChannel.id);
    }
  }, [selectedChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async (channelId: string) => {
    setIsLoading(true);
    try {
      const channelMessages = await DatabaseService.getChannelMessages(channelId);
      setMessages(channelMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel) return;

    const messageData = {
      channel_id: selectedChannel.id,
      sender_id: currentUserId,
      content: newMessage.trim(),
      message_type: 'text' as const
    };

    try {
      const sentMessage = await DatabaseService.sendMessage(messageData);
      if (sentMessage) {
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChannelIcon = (channel: DatabaseChannel) => {
    if (channel.channel_type === 'support') return '🛠️';
    if (channel.is_official) return '✅';
    return '#';
  };

  return (
    <div className="flex h-[700px] bg-background rounded-lg border border-border/40 overflow-hidden">
      {/* Channels Sidebar */}
      <div className="w-80 border-r border-border/40 bg-card/50">
        <div className="p-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg gradient-text">Telegram Nexus</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100%-80px)]">
          <div className="p-2 space-y-1">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className={`
                  p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${selectedChannel?.id === channel.id 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-muted/50'
                  }
                `}
                onClick={() => setSelectedChannel(channel)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
                    {getChannelIcon(channel)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm truncate">{channel.name}</p>
                      {channel.is_official && (
                        <Badge variant="outline" className="text-xs">
                          Official
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {channel.description}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {channel.member_count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border/40 bg-card/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white">
                    {getChannelIcon(selectedChannel)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{selectedChannel.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedChannel.member_count.toLocaleString()} members
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Hash className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-3 group">
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarImage src={message.sender?.avatar_url} />
                        <AvatarFallback className="text-xs bg-gradient-secondary text-white">
                          {message.sender?.first_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">
                            {message.sender?.first_name}
                          </span>
                          {message.sender?.username && (
                            <span className="text-xs text-muted-foreground">
                              @{message.sender.username}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatTime(message.created_at)}
                          </span>
                          {message.is_pinned && (
                            <Pin className="w-3 h-3 text-primary" />
                          )}
                        </div>
                        <div className="prose prose-sm max-w-none text-foreground">
                          {message.message_type === 'text' ? (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                          ) : (
                            <div className="text-sm text-muted-foreground italic">
                              {message.content}
                            </div>
                          )}
                        </div>
                        {message.edited_at && (
                          <span className="text-xs text-muted-foreground italic">
                            edited
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border/40 bg-card/50">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Smile className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="pr-12"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Hash className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Select a channel to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};