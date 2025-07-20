import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import { DatabaseService, DatabasePurchase, DatabaseNotification } from '@/services/database';
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Users,
  Activity,
  Bell,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar
} from 'lucide-react';

interface DashboardProps {
  userId: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    activeAccounts: 0
  });
  const [recentPurchases, setRecentPurchases] = useState<DatabasePurchase[]>([]);
  const [notifications, setNotifications] = useState<DatabaseNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      const [statsData, purchases, userNotifications] = await Promise.all([
        DatabaseService.getDashboardStats(userId),
        DatabaseService.getUserPurchases(userId),
        DatabaseService.getUserNotifications(userId)
      ]);

      setStats(statsData);
      setRecentPurchases(purchases.slice(0, 5));
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'processing': return 'bg-warning text-warning-foreground';
      case 'pending': return 'bg-muted text-muted-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Activity className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass backdrop-blur-md border-white/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold gradient-text">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">+12% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass backdrop-blur-md border-white/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Purchases</p>
                <p className="text-2xl font-bold gradient-text">{stats.totalPurchases.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={60} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">+8% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass backdrop-blur-md border-white/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold gradient-text">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-6 h-6 text-warning" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">+25% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass backdrop-blur-md border-white/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Accounts</p>
                <p className="text-2xl font-bold gradient-text">{stats.activeAccounts.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={90} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">+5% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="purchases" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="purchases" className="flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span>Recent Purchases</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
            {notifications.filter(n => !n.is_read).length > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {notifications.filter(n => !n.is_read).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="purchases" className="space-y-4">
          <Card className="glass backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Recent Purchases</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentPurchases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No purchases yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPurchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-card border border-border/20">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(purchase.status)}
                          <Badge className={getStatusColor(purchase.status)}>
                            {purchase.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium">
                            {purchase.quantity} {purchase.country?.name || 'Unknown'} account{purchase.quantity > 1 ? 's' : ''}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(purchase.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(purchase.total_price)}</p>
                        {purchase.status === 'completed' && (
                          <Button variant="ghost" size="sm" className="mt-1">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="glass backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        notification.is_read 
                          ? 'bg-muted/30 border-border/20' 
                          : 'bg-primary/5 border-primary/20 shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatDate(notification.created_at)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {notification.type}
                            </Badge>
                          </div>
                        </div>
                        {notification.action_url && (
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle>Purchase Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Analytics chart would go here</p>
                    <p className="text-sm">Connect to analytics service</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle>Popular Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['🇸🇦 Saudi Arabia', '🇺🇸 United States', '🇬🇧 United Kingdom', '🇩🇪 Germany'].map((country, index) => (
                    <div key={country} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{country}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={90 - (index * 15)} className="w-20 h-2" />
                        <span className="text-xs text-muted-foreground w-10">
                          {90 - (index * 15)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};