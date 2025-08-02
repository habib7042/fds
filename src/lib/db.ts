// Mock data for the FDS system
export const mockUsers = [
  {
    id: '1',
    email: 'accountant@fds.com',
    password: 'accountant123',
    name: 'হিসাবরক্ষক',
    role: 'ACCOUNTANT'
  },
  {
    id: '2',
    email: 'member1@fds.com',
    password: 'member123',
    name: 'সদস্য ১',
    role: 'MEMBER'
  },
  {
    id: '3',
    email: 'member2@fds.com',
    password: 'member123',
    name: 'সদস্য ২',
    role: 'MEMBER'
  }
]

export const mockMembers = [
  {
    id: '1',
    userId: '2',
    phone: '01712345678',
    address: 'ঢাকা, বাংলাদেশ',
    monthlyFee: 1000,
    totalBalance: 12000,
    dueAmount: 1000,
    isActive: true
  },
  {
    id: '2',
    userId: '3',
    phone: '01812345678',
    address: 'চট্টগ্রাম, বাংলাদেশ',
    monthlyFee: 1000,
    totalBalance: 8000,
    dueAmount: 0,
    isActive: true
  }
]

export const mockPayments = [
  {
    id: '1',
    memberId: '1',
    userId: '2',
    amount: 1000,
    paymentMethod: 'BKASH',
    transactionId: 'TX123456',
    cashNote: null,
    paymentDate: new Date('2024-12-01'),
    approved: true,
    approvedBy: '1',
    approvedAt: new Date('2024-12-01'),
    status: 'APPROVED'
  },
  {
    id: '2',
    memberId: '2',
    userId: '3',
    amount: 1000,
    paymentMethod: 'NAGAD',
    transactionId: 'TX789012',
    cashNote: null,
    paymentDate: new Date('2024-12-01'),
    approved: true,
    approvedBy: '1',
    approvedAt: new Date('2024-12-01'),
    status: 'APPROVED'
  },
  {
    id: '3',
    memberId: '1',
    userId: '2',
    amount: 1000,
    paymentMethod: 'CASH',
    transactionId: null,
    cashNote: 'ডিসেম্বর মাসের চাঁদা',
    paymentDate: new Date(),
    approved: false,
    approvedBy: null,
    approvedAt: null,
    status: 'PENDING'
  }
]

export const mockFund = {
  id: '1',
  name: 'FDS',
  totalAmount: 24000,
  totalMembers: 24,
  monthlyCollected: 2000,
  lastUpdated: new Date()
}

// Database service that works with mock data
export const databaseService = {
  // User operations
  async findUser(email: string, role: string) {
    return mockUsers.find(u => u.email === email && u.role === role.toUpperCase())
  },

  async getUserById(id: string) {
    return mockUsers.find(u => u.id === id)
  },

  // Member operations
  async getMembers() {
    return mockMembers.map(member => ({
      ...member,
      user: mockUsers.find(u => u.id === member.userId)
    }))
  },

  async getMemberByUserId(userId: string) {
    const member = mockMembers.find(m => m.userId === userId)
    return member ? {
      ...member,
      user: mockUsers.find(u => u.id === member.userId)
    } : null
  },

  // Payment operations
  async getPayments() {
    return mockPayments.map(payment => ({
      ...payment,
      member: {
        ...mockMembers.find(m => m.id === payment.memberId),
        user: mockUsers.find(u => u.id === mockMembers.find(m => m.id === payment.memberId)?.userId)
      },
      user: mockUsers.find(u => u.id === payment.userId)
    }))
  },

  async getPendingPayments() {
    return mockPayments
      .filter(p => p.status === 'PENDING')
      .map(payment => ({
        ...payment,
        member: {
          ...mockMembers.find(m => m.id === payment.memberId),
          user: mockUsers.find(u => u.id === mockMembers.find(m => m.id === payment.memberId)?.userId)
        },
        user: mockUsers.find(u => u.id === payment.userId)
      }))
  },

  async createPayment(paymentData: any) {
    const newPayment = {
      id: Date.now().toString(),
      ...paymentData,
      paymentDate: new Date(),
      approved: false,
      approvedBy: null,
      approvedAt: null,
      status: 'PENDING'
    }
    
    mockPayments.push(newPayment)
    return newPayment
  },

  async updatePaymentStatus(id: string, status: string, approvedBy: string) {
    const paymentIndex = mockPayments.findIndex(p => p.id === id)
    if (paymentIndex !== -1) {
      mockPayments[paymentIndex] = {
        ...mockPayments[paymentIndex],
        status,
        approved: status === 'APPROVED',
        approvedBy,
        approvedAt: new Date()
      }
    }
    
    return mockPayments[paymentIndex]
  },

  // Fund operations
  async getFund() {
    return mockFund
  }
}