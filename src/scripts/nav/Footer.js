export const Footer = () => {
    return `
        <footer class="footer">
            <div class="footer__item">
                Posts since <select id="yearSelection">
                    <option>2020</option>
                    <option>2019</option>
                    <option>2018</option>
                    <option>2017</option>
                </select>
                <span id="postCount">0</span>
            </div>
            <div>
            <p >Taryn Lytle &copy; 2021 Cohort 47 <a href="http://nashvillesoftwareschool.com/">Nashville Software School</a></p>
            </div>
        </footer>
    `
}