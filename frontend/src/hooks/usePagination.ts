import { useMemo } from 'react'

const range = (start: number, end: number) => {
  const length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

type UsePaginationPropsType = {
  totalCount: number
  siblingCount?: number
  currentPage: number
}

const usePagination = ({
  totalCount,
  siblingCount = 2,
  currentPage
}: UsePaginationPropsType) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = totalCount
    const totalPageNumbers = siblingCount + 5

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    )

    const middleRange = range(leftSiblingIndex, rightSiblingIndex)
    return [...middleRange]
  }, [totalCount, siblingCount, currentPage])

  return paginationRange
}

export default usePagination
