'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Users, Calculator, DollarSign, Shield, Smartphone, CreditCard, LogOut } from 'lucide-react'
import { mockUsers, databaseService } from '@/lib/db'

interface User {
  id: string
  email: string
  name: string
  role: 'ACCOUNTANT' | 'MEMBER'
}

export default function Home() {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    role: ''
  })
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if user is logged in on component mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      const savedUser = localStorage.getItem('fdsUser')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Find user in mock data
      const foundUser = await databaseService.findUser(loginForm.email, loginForm.role)
      
      if (foundUser && foundUser.password === loginForm.password) {
        const userData = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role
        }
        
        // Save to localStorage
        localStorage.setItem('fdsUser', JSON.stringify(userData))
        setUser(userData)
        setLoginForm({ email: '', password: '', role: '' })
      } else {
        setError('ভুল ইমেইল, পাসওয়ার্ড বা ভূমিকা')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('সার্ভার এরর ঘটেছে')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('fdsUser')
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setLoginForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  // If user is logged in, show dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-green-700">FDS</h1>
                </div>
                <nav className="ml-10 flex items-baseline space-x-4">
                  <a href="#" className="text-gray-900 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium">
                    ড্যাশবোর্ড
                  </a>
                  {user.role === 'ACCOUNTANT' && (
                    <>
                      <a href="#" className="text-gray-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium">
                        সদস্য ব্যবস্থাপনা
                      </a>
                      <a href="#" className="text-gray-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium">
                        পেমেন্ট অনুমোদন
                      </a>
                    </>
                  )}
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  স্বাগতম, {user.name}
                  <Badge variant="secondary" className="ml-2">
                    {user.role === 'ACCOUNTANT' ? 'হিসাবরক্ষক' : 'সদস্য'}
                  </Badge>
                </div>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  লগআউট
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {user.role === 'ACCOUNTANT' ? (
              <AccountantDashboard />
            ) : (
              <MemberDashboard userName={user.name} />
            )}
          </div>
        </main>
      </div>
    )
  }

  // Show login form if not logged in
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-green-700">FDS</h1>
              </div>
              <nav className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-900 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium">
                  হোম
                </a>
                <a href="#" className="text-gray-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium">
                  আমাদের সম্পর্কে
                </a>
                <a href="#" className="text-gray-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium">
                  যোগাযোগ
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">FDS ফান্ড ম্যানেজমেন্ট</span>
            <span className="block text-green-600 mt-2">সিস্টেম</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            বন্ধুদের মধ্যে ফান্ড ব্যবস্থাপনার একটি আধুনিক এবং নিরাপদ প্ল্যাটফর্ম। সহজেই মাসিক চাঁদা জমা দিন, আপনার হিসাব দেখুন এবং ফান্ডের সব তথ্য এক জায়গায় পান।
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              আমাদের সেবাসমূহ
            </h3>
            <p className="mt-4 text-xl text-gray-600">
              আমরা যে সুবিধাগুলো অফার করি
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="mt-4">সদস্য ব্যবস্থাপনা</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  সদস্যদের তথ্য যোগ, সম্পাদনা এবং ব্যবস্থাপনা করুন সহজেই।
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="mt-4">চাঁদা ব্যবস্থাপনা</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  মাসিক চাঁদা ট্র্যাক করুন এবং বকেয়া তথ্য দেখুন।
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="mt-4">হিসাব রক্ষণ</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  স্বচ্ছ এবং নির্ভুল হিসাব রক্ষণ ব্যবস্থা।
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="mt-4">নিরাপত্তা</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  আপনার তথ্য এবং টাকা সম্পূর্ণ নিরাপদে রাখা হয়।
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle className="mt-4">মোবাইল পেমেন্ট</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  বিকাশ এবং নগদ দিয়ে সহজে চাঁদা জমা দিন।
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="mt-4">বহুমুখী পেমেন্ট</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  বিকাশ, নগদ এবং ক্যাশ - যেকোনো মাধ্যমে পেমেন্ট করুন।
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">লগইন করুন</CardTitle>
              <CardDescription>
                আপনার একাউন্টে লগইন করে FDS ফান্ড ম্যানেজমেন্ট সিস্টেম ব্যবহার করুন
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4" variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">আপনি কে?</Label>
                  <Select onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="আপনার ভূমিকা নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accountant">হিসাবরক্ষক</SelectItem>
                      <SelectItem value="member">সদস্য</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">ইমেইল</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="আপনার ইমেইল লিখুন"
                    value={loginForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">পাসওয়ার্ড</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                    value={loginForm.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  নতুন সদস্য?{' '}
                  <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                    রেজিস্ট্রেশন করুন
                  </a>
                </p>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">ডেমো লগইন:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>হিসাবরক্ষক:</strong> accountant@fds.com / accountant123</p>
                  <p><strong>সদস্য:</strong> member1@fds.com / member123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">FDS ফান্ড ম্যানেজমেন্ট</h3>
              <p className="mt-2 text-gray-600">
                বন্ধুদের মধ্যে ফান্ড ব্যবস্থাপনার একটি আধুনিক প্ল্যাটফর্ম।
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">দ্রুত লিংক</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-700">হোম</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-700">আমাদের সম্পর্কে</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-700">যোগাযোগ</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">যোগাযোগ</h3>
              <p className="mt-2 text-gray-600">
                যেকোনো প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করুন।
              </p>
              <p className="mt-2 text-gray-600">
                ইমেইল: support@fds-fund.com
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              © 2024 FDS ফান্ড ম্যানেজমেন্ট সিস্টেম। সর্বস্বত্ব সংরক্ষিত।
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Accountant Dashboard Component
function AccountantDashboard() {
  const [members, setMembers] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [fund, setFund] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const membersData = await databaseService.getMembers()
      const paymentsData = await databaseService.getPayments()
      const fundData = await databaseService.getFund()
      
      setMembers(membersData)
      setPayments(paymentsData)
      setFund(fundData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">লোড হচ্ছে...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">হিসাবরক্ষক ড্যাশবোর্ড</h1>
        <p className="mt-2 text-gray-600">সদস্য ব্যবস্থাপনা এবং পেমেন্ট অনুমোদন করুন</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট সদস্য</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-muted-foreground">
              সক্রিয় সদস্য: {members.filter(m => m.isActive).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট ফান্ড</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{fund?.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              এই মাসে সংগ্রহ: ৳{fund?.monthlyCollected.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">অপেক্ষমান পেমেন্ট</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.filter(p => p.status === 'PENDING').length}</div>
            <p className="text-xs text-muted-foreground">
              অনুমোদনের অপেক্ষায়
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">সদস্য তালিকা</TabsTrigger>
          <TabsTrigger value="payments">পেমেন্ট অনুমোদন</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>সদস্য তালিকা</CardTitle>
              <CardDescription>সকল সদস্যদের তথ্য এবং হিসাব</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-700 font-semibold">
                          {member.user?.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.user?.name}</h3>
                        <p className="text-sm text-gray-600">{member.phone}</p>
                        <p className="text-sm text-gray-600">{member.address}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">৳{member.totalBalance.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">
                        বকেয়া: ৳{member.dueAmount.toLocaleString()}
                      </div>
                      <Badge variant={member.isActive ? "default" : "secondary"}>
                        {member.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>পেমেন্ট অনুমোদন</CardTitle>
              <CardDescription>অপেক্ষমান পেমেন্টগুলো অনুমোদন করুন</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.filter(p => p.status === 'PENDING').map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-semibold">
                          {payment.member?.user?.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{payment.member?.user?.name}</h3>
                        <p className="text-sm text-gray-600">
                          {payment.paymentMethod} - ৳{payment.amount.toLocaleString()}
                        </p>
                        {payment.transactionId && (
                          <p className="text-sm text-gray-600">
                            ট্রানজেকশন ID: {payment.transactionId}
                          </p>
                        )}
                        {payment.cashNote && (
                          <p className="text-sm text-gray-600">
                            নোট: {payment.cashNote}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => {
                          // Mock approval
                          payment.status = 'APPROVED'
                          payment.approved = true
                          payment.approvedAt = new Date()
                          setPayments([...payments])
                        }}
                      >
                        অনুমোদন করুন
                      </Button>
                    </div>
                  </div>
                ))}
                {payments.filter(p => p.status === 'PENDING').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    কোন অপেক্ষমান পেমেন্ট নেই
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Member Dashboard Component
function MemberDashboard({ userName }: { userName: string }) {
  const [member, setMember] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: '',
    transactionId: '',
    cashNote: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Mock member data for demo
      const mockMemberData = {
        id: '1',
        userId: '2',
        phone: '01712345678',
        address: 'ঢাকা, বাংলাদেশ',
        monthlyFee: 1000,
        totalBalance: 12000,
        dueAmount: 1000,
        isActive: true,
        user: {
          id: '2',
          name: 'সদস্য ১',
          email: 'member1@fds.com',
          role: 'MEMBER'
        }
      }
      
      const paymentsData = await databaseService.getPayments()
      const memberPayments = paymentsData.filter(p => p.userId === '2')
      
      setMember(mockMemberData)
      setPayments(memberPayments)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mock payment submission
    const newPayment = {
      id: Date.now().toString(),
      memberId: member.id,
      userId: member.userId,
      amount: parseInt(paymentForm.amount),
      paymentMethod: paymentForm.paymentMethod,
      transactionId: paymentForm.paymentMethod === 'CASH' ? null : paymentForm.transactionId,
      cashNote: paymentForm.paymentMethod === 'CASH' ? paymentForm.cashNote : null,
      paymentDate: new Date(),
      approved: false,
      approvedBy: null,
      approvedAt: null,
      status: 'PENDING',
      member: member,
      user: member.user
    }
    
    setPayments([newPayment, ...payments])
    setShowPaymentForm(false)
    setPaymentForm({ amount: '', paymentMethod: '', transactionId: '', cashNote: '' })
  }

  if (loading) {
    return <div className="text-center py-8">লোড হচ্ছে...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">সদস্য ড্যাশবোর্ড</h1>
        <p className="mt-2 text-gray-600">স্বাগতম {userName}, আপনার হিসাব তথ্য দেখুন</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট জমা</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{member?.totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              আপনার মোট জমার পরিমাণ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">বকেয়া</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{member?.dueAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              মাসিক চাঁদা বকেয়া
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মাসিক চাঁদা</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{member?.monthlyFee.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              প্রতি মাসের চাঁদার পরিমাণ
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">পেমেন্ট ইতিহাস</h2>
        <Button onClick={() => setShowPaymentForm(true)}>
          নতুন পেমেন্ট জমা দিন
        </Button>
      </div>

      {showPaymentForm && (
        <Card>
          <CardHeader>
            <CardTitle>নতুন পেমেন্ট জমা দিন</CardTitle>
            <CardDescription>মাসিক চাঁদা জমা দেওয়ার জন্য ফর্মটি পূরণ করুন</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">পরিমাণ</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="পরিমাণ লিখুন"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">পেমেন্ট মেথড</Label>
                <Select onValueChange={(value) => setPaymentForm(prev => ({ ...prev, paymentMethod: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="পেমেন্ট মেথড নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BKASH">বিকাশ</SelectItem>
                    <SelectItem value="NAGAD">নগদ</SelectItem>
                    <SelectItem value="CASH">ক্যাশ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(paymentForm.paymentMethod === 'BKASH' || paymentForm.paymentMethod === 'NAGAD') && (
                <div className="space-y-2">
                  <Label htmlFor="transactionId">ট্রানজেকশন ID</Label>
                  <Input
                    id="transactionId"
                    placeholder="ট্রানজেকশন ID লিখুন"
                    value={paymentForm.transactionId}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, transactionId: e.target.value }))}
                    required
                  />
                </div>
              )}

              {paymentForm.paymentMethod === 'CASH' && (
                <div className="space-y-2">
                  <Label htmlFor="cashNote">নোট</Label>
                  <Input
                    id="cashNote"
                    placeholder="ক্যাশ পেমেন্টের নোট লিখুন"
                    value={paymentForm.cashNote}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, cashNote: e.target.value }))}
                    required
                  />
                </div>
              )}

              <div className="flex space-x-2">
                <Button type="submit">জমা দিন</Button>
                <Button type="button" variant="outline" onClick={() => setShowPaymentForm(false)}>
                  বাতিল করুন
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>পেমেন্ট ইতিহাস</CardTitle>
          <CardDescription>আপনার সকল পেমেন্টের তালিকা</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    payment.status === 'APPROVED' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    <span className={`${
                      payment.status === 'APPROVED' ? 'text-green-700' : 'text-yellow-700'
                    } font-semibold`}>
                      ৳
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">৳{payment.amount.toLocaleString()}</h3>
                    <p className="text-sm text-gray-600">{payment.paymentMethod}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(payment.paymentDate).toLocaleDateString('bn-BD')}
                    </p>
                    {payment.transactionId && (
                      <p className="text-sm text-gray-600">
                        ট্রানজেকশন ID: {payment.transactionId}
                      </p>
                    )}
                    {payment.cashNote && (
                      <p className="text-sm text-gray-600">
                        নোট: {payment.cashNote}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Badge variant={payment.status === 'APPROVED' ? "default" : "secondary"}>
                    {payment.status === 'APPROVED' ? "অনুমোদিত" : "অপেক্ষমান"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}