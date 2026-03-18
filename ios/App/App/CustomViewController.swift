import UIKit
import Capacitor

class CustomViewController: CAPBridgeViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        disableBounce()
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        disableBounce()
    }

    private func disableBounce() {
        webView?.scrollView.bounces = false
        webView?.scrollView.alwaysBounceHorizontal = false
        webView?.scrollView.alwaysBounceVertical = false
        webView?.scrollView.isDirectionalLockEnabled = true
        webView?.scrollView.contentInsetAdjustmentBehavior = .never
    }
}
