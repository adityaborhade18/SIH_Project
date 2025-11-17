const footer= () => {
    return (
     <footer class="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500">
    <div class="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
        <div class="md:max-w-96">
            <h2 class="font-bold text-2xl mb-4 text-gray-800">IssuePro</h2>
            <p class="mt-6 text-sm">
                CivicConnect empowers citizens to report issues, track progress, 
                and collaborate with local authorities to build cleaner, safer, 
                and more efficient communities. Together, we create impactful change—one report at a time.
            </p>
        </div>
        <div class="flex-1 flex items-start md:justify-end gap-20">
            <div>
                <h2 class="font-semibold mb-5 text-gray-800"></h2>
                <ul class="text-sm space-y-2">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About us</a></li>
                    <li><a href="#">Contact us</a></li>
                    <li><a href="#">Privacy policy</a></li>
                </ul>
            </div>
            <div>
                <h2 class="font-semibold mb-5 text-gray-800">Get in touch</h2>
                <div class="text-sm space-y-2">
                    
                    <p>IssuePro1828@gmail.com</p>
                </div>
            </div>
        </div>
    </div>
    <p class="pt-4 text-center text-xs md:text-sm pb-5">
        Copyright {new Date().getFullYear()} © <a>IssuePro</a>. All Right Reserved.
    </p>
</footer>
    )
}

export default footer;