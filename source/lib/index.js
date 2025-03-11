const checkForLocation = (data, location) => {
  switch (location) {
    case 'log':
      const isLog = data.some(item => ['сухой', 'лог', 'порош']
        .some(value => item.id.toLowerCase().includes(value)))
      return isLog ? 'log' : 'zar'
  }
}

module.exports = { checkForLocation }
