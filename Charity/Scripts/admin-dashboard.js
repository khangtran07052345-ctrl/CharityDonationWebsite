
document.addEventListener("DOMContentLoaded", function () {

    // Kiểm tra thư viện Chart.js đã được tải chưa
    if (typeof Chart === "undefined") {
        console.error("Không tìm thấy thư viện Chart.js.");
        return;
    }

    // Lấy dữ liệu thống kê từ thẻ HTML
    var container = document.getElementById("adminChartData");

    if (container === null) {
        console.error("Không tìm thấy phần tử adminChartData.");
        return;
    }

    // Đọc dữ liệu tiến độ tổng quan
    var overallProgress =
        parseInt(container.getAttribute("data-overall"), 10) || 0;

    var remainingProgress =
        parseInt(container.getAttribute("data-remaining"), 10) || 0;

    // Đọc dữ liệu chiến dịch và hiện vật
    var campaignNames = JSON.parse(
        container.getAttribute("data-names") || "[]"
    );

    var campaignAmounts = JSON.parse(
        container.getAttribute("data-amounts") || "[]"
    );

    var inKindData = JSON.parse(
        container.getAttribute("data-inkind") || "[]"
    );

    // Lấy các phần tử canvas
    var progressCanvas = document.getElementById("progressCircleChart");
    var campaignCanvas = document.getElementById("campaignLineChart");
    var inKindCanvas = document.getElementById("inKindBarChart");

    // 1. BIỂU ĐỒ TRÒN TIẾN ĐỘ TỔNG QUAN
    if (progressCanvas !== null) {

        new Chart(progressCanvas, {
            type: "doughnut",

            data: {
                labels: [
                    "Đã đạt (" + overallProgress + "%)",
                    "Còn lại (" + remainingProgress + "%)"
                ],

                datasets: [{
                    data: [overallProgress, remainingProgress],
                    backgroundColor: ["#0d6efd", "#e9ecef"],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "75%",

                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });
    }

    // 2. BIỂU ĐỒ ĐƯỜNG SỐ TIỀN CÁC CHIẾN DỊCH
    if (campaignCanvas !== null) {

        new Chart(campaignCanvas, {
            type: "line",

            data: {
                labels: campaignNames,

                datasets: [{
                    label: "Số tiền nhận được (VNĐ)",
                    data: campaignAmounts,
                    borderColor: "#0d6efd",
                    backgroundColor: "rgba(13, 110, 253, 0.1)",
                    borderWidth: 3,
                    pointBackgroundColor: "#0d6efd",
                    pointRadius: 5,
                    fill: true,
                    tension: 0.3
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                scales: {
                    y: {
                        beginAtZero: true,

                        ticks: {
                            callback: function (value) {
                                return value.toLocaleString("vi-VN") + " đ";
                            }
                        }
                    }
                },

                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return " Đã nhận: " +
                                    context.parsed.y.toLocaleString("vi-VN") +
                                    " đ";
                            }
                        }
                    }
                }
            }
        });
    }

    // 3. BIỂU ĐỒ CỘT THỐNG KÊ QUYÊN GÓP HIỆN VẬT
    if (inKindCanvas !== null) {

        new Chart(inKindCanvas, {
            type: "bar",

            data: {
                labels: [
                    "Quần áo",
                    "Mì",
                    "Gạo",
                    "Áo ấm",
                    "Sách vở"
                ],

                datasets: [{
                    label: "Tổng số lượng quyên góp hiện vật",
                    data: inKindData,

                    backgroundColor: [
                        "rgba(13, 110, 253, 0.8)",
                        "rgba(255, 193, 7, 0.8)",
                        "rgba(25, 135, 84, 0.8)",
                        "rgba(220, 53, 69, 0.8)",
                        "rgba(111, 66, 192, 0.8)"
                    ],

                    borderColor: [
                        "rgb(13, 110, 253)",
                        "rgb(255, 193, 7)",
                        "rgb(25, 135, 84)",
                        "rgb(220, 53, 69)",
                        "rgb(111, 66, 192)"
                    ],

                    borderWidth: 1,
                    borderRadius: 6,
                    barThickness: 45
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }
});
