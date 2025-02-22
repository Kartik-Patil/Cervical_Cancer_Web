let slideIndex = 0;

    showSlides(slideIndex);



    // Function to change slides

    function plusSlides(n) {

        showSlides(slideIndex += n);

    }



    // Function to display slides

    function showSlides(n) {

        let slides = document.getElementsByClassName("slide");



        if (n >= slides.length) {

            slideIndex = 0;

        }

        if (n < 0) {

            slideIndex = slides.length - 1;

        }



        // Hide all slides

        for (let i = 0; i < slides.length; i++) {

            slides[i].style.display = "none";

        }



        // Show the current slide

        slides[slideIndex].style.display = "block";

    }



    // Auto slide every 5 seconds

    setInterval(() => {

        plusSlides(1);

    }, 5000);

    // left image edit

    document.getElementById("imageUpload").addEventListener("change", function(event) {

        const file = event.target.files[0];

        if (file) {

            const reader = new FileReader();

            reader.onload = function(e) {

                const previewImage = document.getElementById("previewImage");

                previewImage.src = e.target.result;

                previewImage.style.display = "block";

            };

            reader.readAsDataURL(file);

        }

    });

    // js for faq 

    document.addEventListener("DOMContentLoaded", function () {

        const faqs = document.querySelectorAll(".faq-question");



        faqs.forEach((faq) => {

            faq.addEventListener("click", function () {

                const answer = this.nextElementSibling;

                const icon = this.querySelector("span");



                // Toggle display of the answer

                if (answer.style.display === "block") {

                    answer.style.display = "none";

                    icon.textContent = "+"; // Change icon back to +

                } else {

                    // First, close all other open answers

                    document.querySelectorAll(".faq-answer").forEach((el) => {

                        el.style.display = "none";

                    });



                    // Reset all icons

                    document.querySelectorAll(".faq-question span").forEach((el) => {

                        el.textContent = "+";

                    });



                    // Open the clicked answer

                    answer.style.display = "block";

                    icon.textContent = "-"; // Change icon to -

                }

            });

        });

    });

        document.querySelector(".header a").addEventListener("click", function(event) {

            event.preventDefault();

            fetch(this.href)

                .then(response => response.text())

                .then(html => {

                    document.body.innerHTML = html;

                    history.pushState(null, "", this.href);

                });

        });

        // contact 

        document.addEventListener("DOMContentLoaded", function () {

            const form = document.querySelector("form");

        

            form.addEventListener("submit", function (event) {

                event.preventDefault(); // Prevent default form submission

        

                const email = document.getElementById("email").value.trim();

                const phone = document.getElementById("phone").value.trim();

                const message = document.getElementById("message").value.trim();

        

                if (email === "" || phone === "" || message === "") {

                    alert("All fields are required!");

                    return;

                }

        

                // Simple validation for phone number (example: must be 10 digits)

                const phoneRegex = /^[0-9]{10}$/;

                if (!phoneRegex.test(phone)) {

                    alert("Enter a valid 10-digit phone number.");

                    return;

                }

        

                alert("Form submitted successfully!");

                form.submit(); // Proceed with submission

            });

        });

        function toggleMenu() {

            const nav = document.querySelector(".nav-links");

            nav.classList.toggle("active");

        }