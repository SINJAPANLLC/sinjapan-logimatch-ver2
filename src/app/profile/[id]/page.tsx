'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Star, ThumbsUp, Award, Building2, Calendar, MessageSquare } from 'lucide-react'

interface Rating {
  id: string
  score: number
  comment?: string
  createdAt: string
  rater: {
    id: string
    companyName: string
    userType: string
  }
}

interface UserProfile {
  id: string
  companyName: string
  email: string
  userType: string
  trustScore: number
  verificationStatus: string
  createdAt: string
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [avgScore, setAvgScore] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  // 評価フォーム
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [ratingScore, setRatingScore] = useState(5)
  const [ratingComment, setRatingComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    fetchProfile()
    fetchRatings()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRatings = async () => {
    try {
      const response = await fetch(`/api/ratings?userId=${userId}`)
      
      if (response.ok) {
        const data = await response.json()
        setRatings(data.ratings)
        setAvgScore(data.avgScore)
        setTotalRatings(data.totalRatings)
      }
    } catch (error) {
      console.error('Failed to fetch ratings:', error)
    }
  }

  const handleSubmitRating = async () => {
    if (!ratingScore) {
      alert('評価を選択してください')
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ratedUserId: userId,
          score: ratingScore,
          comment: ratingComment
        })
      })

      if (response.ok) {
        alert('評価を投稿しました')
        setShowRatingForm(false)
        setRatingScore(5)
        setRatingComment('')
        fetchRatings()
        fetchProfile()
      } else {
        const error = await response.json()
        alert(error.error || '評価の投稿に失敗しました')
      }
    } catch (error) {
      console.error('Submit rating error:', error)
      alert('評価の投稿に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-5 w-5 ${i < score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">ユーザーが見つかりませんでした</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 text-blue-600 hover:underline"
          >
            ダッシュボードに戻る
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const canRate = currentUser && currentUser.id !== userId

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* プロフィールヘッダー */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.companyName}</h1>
                <p className="text-gray-600">{profile.userType === 'SHIPPER' ? '荷主' : '運送会社'}</p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  登録日: {new Date(profile.createdAt).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </div>
            
            {profile.verificationStatus === 'APPROVED' && (
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center space-x-1">
                <Award className="h-4 w-4" />
                <span>認証済み</span>
              </div>
            )}
          </div>
        </div>

        {/* 信用スコア */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">信用スコア</h2>
              <div className="flex items-center space-x-3">
                <span className="text-5xl font-bold">{avgScore.toFixed(1)}</span>
                <div>
                  <div className="flex items-center space-x-1">
                    {renderStars(Math.round(avgScore))}
                  </div>
                  <p className="text-sm text-blue-100 mt-1">{totalRatings}件の評価</p>
                </div>
              </div>
            </div>
            {canRate && (
              <button
                onClick={() => setShowRatingForm(true)}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>評価する</span>
              </button>
            )}
          </div>
        </div>

        {/* 評価一覧 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">評価・レビュー</h2>
          </div>
          <div className="p-6">
            {ratings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">まだ評価がありません</p>
            ) : (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{rating.rater.companyName}</p>
                        <p className="text-xs text-gray-500">
                          {rating.rater.userType === 'SHIPPER' ? '荷主' : '運送会社'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(rating.score)}
                      </div>
                    </div>
                    {rating.comment && (
                      <div className="mt-2 flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                        <p className="text-sm text-gray-700">{rating.comment}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(rating.createdAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 評価投稿モーダル */}
      {showRatingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">評価を投稿</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                評価スコア
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setRatingScore(score)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`h-8 w-8 ${
                        score <= ratingScore 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                コメント（任意）
              </label>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="取引の感想などをご記入ください"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowRatingForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? '投稿中...' : '投稿'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
