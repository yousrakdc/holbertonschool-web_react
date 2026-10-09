import {expect, test} from '@jest/globals';
import { getCurrentYear, getFooterCopy, getLatestNotification } from './utils'

test('the current year value', () => {
    const currentYear = new Date().getFullYear()
    expect(getCurrentYear()).toBe(currentYear)
})

test('the return value of getFooterCopy depending on the boolean parameter', () => {
    const isIndexFalse = getFooterCopy(false)
    expect(isIndexFalse).toBe("Holberton School main dashboard")
    const isIndexTrue = getFooterCopy(true)
    expect(isIndexTrue).toBe("Holberton School")
})

test('the return string from getLatestNotification', () => {
    expect(getLatestNotification()).toBe("<strong>Urgent requirement</strong> - complete by EOD")
})
