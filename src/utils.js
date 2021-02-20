export function getDateWithoutDay () {
    return new Intl.DateTimeFormat('en-GB', { dateStyle: "long"}).format(new Date())    
}