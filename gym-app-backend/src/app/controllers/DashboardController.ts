import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, subDays } from 'date-fns';

export class DashboardController {
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const instructorId = req.user?.id;

      if (!instructorId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Get total and active clients
      const totalClients = await prisma.client.count({
        where: { instructorId }
      });

      const activeClients = await prisma.client.count({
        where: {
          instructorId,
          lastCheckIn: {
            gte: subDays(new Date(), 30) // Active if checked in within last 30 days
          }
        }
      });

      // Get attendance statistics
      const today = new Date();
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);
      const startOfThisWeek = startOfWeek(today);
      const endOfThisWeek = endOfWeek(today);

      const todayAttendance = await prisma.checkIn.count({
        where: {
          client: { instructorId },
          createdAt: {
            gte: startOfToday,
            lte: endOfToday
          }
        }
      });

      const thisWeekAttendance = await prisma.checkIn.count({
        where: {
          client: { instructorId },
          createdAt: {
            gte: startOfThisWeek,
            lte: endOfThisWeek
          }
        }
      });

      // Calculate average daily attendance (last 30 days)
      const thirtyDaysAgo = subDays(today, 30);
      const dailyAttendance = await prisma.checkIn.groupBy({
        by: ['createdAt'],
        where: {
          client: { instructorId },
          createdAt: {
            gte: thirtyDaysAgo
          }
        },
        _count: true
      });

      const averageDaily = dailyAttendance.length > 0
        ? Math.round(dailyAttendance.reduce((acc: number, curr: { _count: number }) => acc + curr._count, 0) / dailyAttendance.length)
        : 0;

      // Get peak hour and day
      const checkIns = await prisma.checkIn.findMany({
        where: {
          client: { instructorId },
          createdAt: {
            gte: thirtyDaysAgo
          }
        },
        select: {
          createdAt: true
        }
      });

      const peakHour = checkIns.length > 0 ? this.calculatePeakHour(checkIns) : '00:00';
      const peakDay = checkIns.length > 0 ? this.calculatePeakDay(checkIns) : 'Nenhum';

      // Get inactive clients
      const inactiveClients = await prisma.client.findMany({
        where: {
          instructorId,
          lastCheckIn: {
            lt: subDays(today, 7) // Inactive if no check-in for 7+ days
          }
        },
        select: {
          id: true,
          name: true,
          lastCheckIn: true,
          email: true,
          phone: true,
          createdAt: true
        },
        take: 5 // Limit to 5 most inactive clients
      });

      // Get very inactive clients (30+ days)
      const veryInactiveClients = await prisma.client.findMany({
        where: {
          instructorId,
          lastCheckIn: {
            lt: subDays(today, 30) // Very inactive if no check-in for 30+ days
          }
        },
        select: {
          id: true,
          name: true,
          lastCheckIn: true,
          email: true,
          phone: true,
          createdAt: true
        },
        take: 3 // Limit to 3 most inactive clients
      });

      // Mock data for demonstration
      const mockInactiveClients = [
        {
          id: 'mock-1',
          name: 'João Silva',
          email: 'joao.silva@email.com',
          phone: '(11) 98765-4321',
          lastCheckIn: subDays(today, 10),
          createdAt: subDays(today, 120)
        },
        {
          id: 'mock-2',
          name: 'Maria Santos',
          email: 'maria.santos@email.com',
          phone: '(11) 91234-5678',
          lastCheckIn: subDays(today, 15),
          createdAt: subDays(today, 90)
        }
      ];

      const mockVeryInactiveClients = [
        {
          id: 'mock-3',
          name: 'Pedro Oliveira',
          email: 'pedro.oliveira@email.com',
          phone: '(11) 99876-5432',
          lastCheckIn: subDays(today, 45),
          createdAt: subDays(today, 180)
        }
      ];

      // Always use mock data for demonstration
      const finalInactiveClients = mockInactiveClients;
      const finalVeryInactiveClients = mockVeryInactiveClients;

      // Calculate trends
      const newClientsThisMonth = await prisma.client.count({
        where: {
          instructorId,
          createdAt: {
            gte: startOfDay(new Date(today.getFullYear(), today.getMonth(), 1))
          }
        }
      });

      const retentionRate = totalClients > 0
        ? `${Math.round((activeClients / totalClients) * 100)}%`
        : '0%';

      // Calculate average check-in duration (mock data for now)
      const averageCheckIn = '45 min';

      res.json({
        totalClients,
        activeClients,
        attendance: {
          today: todayAttendance,
          thisWeek: thisWeekAttendance,
          averageDaily,
          peakHour,
          peakDay
        },
        inactiveClients: {
          recent: finalInactiveClients.map(client => ({
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            daysInactive: Math.floor((today.getTime() - (client.lastCheckIn?.getTime() || today.getTime())) / (1000 * 60 * 60 * 24)),
            lastCheckIn: client.lastCheckIn,
            memberSince: client.createdAt
          })),
          veryInactive: finalVeryInactiveClients.map(client => ({
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            daysInactive: Math.floor((today.getTime() - (client.lastCheckIn?.getTime() || today.getTime())) / (1000 * 60 * 60 * 24)),
            lastCheckIn: client.lastCheckIn,
            memberSince: client.createdAt
          }))
        },
        trends: {
          newClientsThisMonth,
          retentionRate,
          averageCheckIn
        }
      });
    } catch (error) {
      console.error('Error in getStatistics:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
  }

  private calculatePeakHour(checkIns: { createdAt: Date }[]): string {
    const hourCounts = new Array(24).fill(0);
    
    checkIns.forEach(checkIn => {
      const hour = checkIn.createdAt.getHours();
      hourCounts[hour]++;
    });

    const peakHourIndex = hourCounts.indexOf(Math.max(...hourCounts));
    return `${peakHourIndex.toString().padStart(2, '0')}:00`;
  }

  private calculatePeakDay(checkIns: { createdAt: Date }[]): string {
    const dayCounts = new Array(7).fill(0);
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    
    checkIns.forEach(checkIn => {
      const day = checkIn.createdAt.getDay();
      dayCounts[day]++;
    });

    const peakDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
    return days[peakDayIndex];
  }
} 