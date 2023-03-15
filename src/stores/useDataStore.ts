import { defineStore } from 'pinia'
import { useMysqlStore } from './useMysqlStore'
import type { Basetype } from 'src/types/basetype'

import type { Subcategory } from 'src/types/subcategory'

export const useDataStore = defineStore('data', () => {
  const mysqlStore = useMysqlStore()

  const findDuplicate = (name: string): boolean => {
    const lowered = name.toLowerCase()
    let result = false
    if (mysqlStore.categories) {
      // find duplicate in category
      result = mysqlStore.categories.some(c => c.name.toLowerCase() === lowered)
    }
    return result
  }

  const findDuplicateSub = (name: string, categoryId: number): boolean => {
    if (mysqlStore.categories) {
      // find category
      const targetCategory = mysqlStore.categories.find(c => c.id === categoryId)

      // find duplicate in subcategory
      if (
        targetCategory &&
        targetCategory.subcategories &&
        targetCategory.subcategories.length > 0
      ) {
        return targetCategory.subcategories.some(
          sub => sub.name.toLowerCase() === name.toLowerCase()
        )
      } else return false
    }
    return false
  }

  const hasChild = (cId: number) => {
    if (mysqlStore.categories) {
      const targetCategory = mysqlStore.categories.find(c => c.id === cId)
      if (targetCategory) {
        return targetCategory.subcategories.length > 0
      }
    }
    return false
  }

  const updateCategories = (category: Basetype) => {
    try {
      const { id, name } = category
      if (!id || !name) throw new Error('Cannot find new category')
      if (!mysqlStore.categories) throw new Error('Cannot find categories')

      const targetIndex = mysqlStore.categories.findIndex(c => c.id === id)
      if (targetIndex === -1) throw new Error('Cannot find categories')

      mysqlStore.categories[targetIndex].name = name
    } catch (error) {
      console.log('update failed: ' + error)
    }
  }

  const updateSubcategories = (newSubcategory: Subcategory) => {
    try {
      if (!newSubcategory) throw new Error('Cannot find new subcategory')
      const { id, category_id } = newSubcategory

      // update const subcategories
      if (!mysqlStore.subcategories) throw new Error('Cannot find subcategories')
      const targetSubIndex = mysqlStore.subcategories.findIndex(sub => sub.id === id)
      if (targetSubIndex === -1) throw new Error('Cannot find target')
      mysqlStore.subcategories[targetSubIndex] = newSubcategory

      // update const categories
      if (!mysqlStore.categories) throw new Error('Cannot find categories')
      const targetCate = mysqlStore.categories.find(c => c.id === category_id)
      if (!targetCate) throw new Error('Cannot find target')
      const subIndex = targetCate.subcategories.findIndex(sub => sub.id === id)
      if (subIndex === -1) throw new Error('Cannot find target')
      targetCate.subcategories[targetSubIndex] = newSubcategory
    } catch (error) {
      console.log('update failed: ' + error)
    }
  }

  const createCategory = (newName: string, newId: number) => {
    const newCate = { id: newId, name: newName, subcategories: [] }
    // update const categories
    if (mysqlStore.categories) {
      mysqlStore.categories.push(newCate)
    } else console.log('Cannot find categories')
  }

  const createSubcategory = (newSubcategory: Subcategory) => {
    try {
      // update const categories
      if (!mysqlStore.categories) throw new Error('Cannot find categories')
      const targetCategory = mysqlStore.categories.find(
        c => c.id === newSubcategory.category_id
      )
      if (!targetCategory) throw new Error('Cannot find target')
      targetCategory.subcategories.push(newSubcategory)

      // update const subcatgories
      if (!mysqlStore.subcategories) throw new Error('Cannot find subcategories')
      mysqlStore.subcategories.push(newSubcategory)
    } catch (error) {
      console.log('create failed: ' + error)
    }
  }

  const deleteCategory = (cId: number) => {
    try {
      if (!mysqlStore.categories) throw new Error('Cannot find categories')
      const targetIndex = mysqlStore.categories.findIndex(c => c.id === cId)
      if (targetIndex === -1) throw new Error('Cannot find target')
      mysqlStore.categories.splice(targetIndex, 1)
    } catch (error) {
      console.log('delete failed: ' + error)
    }
  }

  const deleteSubategory = (subId: number) => {
    try {
      let cId = 0
      // update const subcategories
      if (!mysqlStore.subcategories) throw new Error('Cannot find subcategories')
      const subIndex = mysqlStore.subcategories.findIndex(sub => sub.id === subId)
      if (subIndex === -1) throw new Error('Cannot find target')
      cId = mysqlStore.subcategories[subIndex].category_id
      mysqlStore.subcategories.splice(subIndex, 1)

      // update const categories
      if (!mysqlStore.categories) throw new Error('Cannot find categories')
      const targetCategory = mysqlStore.categories.find(c => c.id === cId)
      if (!targetCategory) throw new Error('Cannot find target')
      const cIndex = targetCategory.subcategories.findIndex(s => s.id === subId)
      if (cIndex === -1) throw new Error('Cannot find target')
      targetCategory.subcategories.splice(cIndex, 1)
    } catch (error) {
      console.log('delete failed: ' + error)
    }
  }

  return {
    findDuplicate,
    findDuplicateSub,
    hasChild,
    updateCategories,
    updateSubcategories,
    createCategory,
    createSubcategory,
    deleteCategory,
    deleteSubategory,
  }
})
