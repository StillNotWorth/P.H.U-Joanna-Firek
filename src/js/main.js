const date = document.querySelector('.date')

const handleCurrentYear = () => {
	const year = new Date().getFullYear()
	date.innerText = year
}
handleCurrentYear()
