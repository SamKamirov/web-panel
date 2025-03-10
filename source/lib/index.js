const checkForLocation = (data, location) => {
  switch (location) {
    case 'log':
      return data.some(item => ['сухой', 'лог', 'порош']
        .some(value => item.id.toLowerCase().includes(value))) && 'log'
    default:
      return 'zar'
  }
}

module.exports = { checkForLocation }
