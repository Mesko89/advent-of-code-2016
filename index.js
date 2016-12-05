const day = parseInt(process.argv[2]);

if (isNaN(day) || !day) {
  console.log('Usage:')
  console.log('')
  console.log('npm start [day]');
  process.exit(0);
}

console.log('Running solutions for day ${day} :)');

require(`./day-${day}`);