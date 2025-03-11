import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/auth/auth-context'

interface CalculatorData {
  id: string
  name: string
  data: any
  calculator_type: string
  created_at: string
  updated_at: string
  is_favorite: boolean
  version: string
  notes?: string
}

interface UseCalculatorDataProps {
  calculatorType: string
}

export function useCalculatorData({ calculatorType }: UseCalculatorDataProps) {
  const [savedCalculations, setSavedCalculations] = useState<CalculatorData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  // Fetch saved calculations
  const fetchCalculations = async () => {
    if (!user) {
      console.log("DEBUG: No user in useCalculatorData, skipping fetch")
      setSavedCalculations([])
      return
    }

    console.log(`DEBUG: Fetching calculator data for type: ${calculatorType}`)
    setIsLoading(true)
    setError(null)

    try {
      console.log(`DEBUG: Making API request to /api/calculator-data?calculatorType=${calculatorType}`)
      const response = await fetch(`/api/calculator-data?calculatorType=${calculatorType}`)
      
      console.log(`DEBUG: API response status: ${response.status}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.log("DEBUG: API error response:", errorData)
        throw new Error(errorData.error || 'Failed to fetch saved calculations')
      }
      
      const data = await response.json()
      console.log("DEBUG: API success response:", data)
      console.log("DEBUG: Setting saved calculations:", data.calculations || [])
      setSavedCalculations(data.calculations || [])
    } catch (err: any) {
      setError(err.message)
      toast({
        title: 'Error',
        description: `Failed to load saved calculations: ${err.message}`,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Save a calculation
  const saveCalculation = async (name: string, data: any): Promise<CalculatorData | null> => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to save calculations',
        variant: 'destructive'
      })
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/calculator-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          data,
          calculatorType
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save calculation')
      }

      const result = await response.json()
      
      // Update the local state with the new calculation
      setSavedCalculations(prev => [result.calculation, ...prev])
      
      toast({
        title: 'Success',
        description: `"${name}" saved successfully!`
      })
      
      return result.calculation
    } catch (err: any) {
      setError(err.message)
      toast({
        title: 'Error',
        description: `Failed to save calculation: ${err.message}`,
        variant: 'destructive'
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Update a calculation
  const updateCalculation = async (id: string, updates: Partial<CalculatorData>): Promise<CalculatorData | null> => {
    if (!user) return null

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/calculator-data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          ...updates
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update calculation')
      }

      const result = await response.json()
      
      // Update the local state - remove the old calculation and add the updated one at the top
      setSavedCalculations(prev => [
        result.calculation,
        ...prev.filter(calc => calc.id !== id)
      ])
      
      toast({
        title: 'Success',
        description: `"${result.calculation.name}" updated successfully!`
      })
      
      return result.calculation
    } catch (err: any) {
      setError(err.message)
      toast({
        title: 'Error',
        description: `Failed to update calculation: ${err.message}`,
        variant: 'destructive'
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a calculation
  const deleteCalculation = async (id: string): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/calculator-data?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete calculation')
      }
      
      // Update the local state
      setSavedCalculations(prev => prev.filter(calc => calc.id !== id))
      
      toast({
        title: 'Success',
        description: 'Calculation deleted successfully!'
      })
      
      return true
    } catch (err: any) {
      setError(err.message)
      toast({
        title: 'Error',
        description: `Failed to delete calculation: ${err.message}`,
        variant: 'destructive'
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Handle user changes and fetch data when user becomes available
  useEffect(() => {
    if (!user) {
      console.log('DEBUG: No user, clearing saved calculations')
      setSavedCalculations([])
    } else {
      console.log('DEBUG: User changed, triggering fetch in useCalculatorData')
      // When user changes to a valid user, fetch their data
      const fetchData = async () => {
        try {
          await fetchCalculations()
        } catch (err) {
          console.error('DEBUG: Error fetching calculations after user change:', err)
        }
      }
      fetchData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return {
    savedCalculations,
    isLoading,
    error,
    fetchCalculations,
    saveCalculation,
    updateCalculation,
    deleteCalculation
  }
}