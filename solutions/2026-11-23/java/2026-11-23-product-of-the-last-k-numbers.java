// Problem: Product of the Last K Numbers
// Link: https://leetcode.com/problems/product-of-the-last-k-numbers/
//
// Approach:
// To efficiently calculate the product of the last k numbers, we can maintain a list of prefix products.
// When a new number `num` is added, we can calculate its prefix product based on the previous prefix product.
// However, a crucial observation is that if a 0 is encountered, all subsequent products involving that 0 will be 0.
// This means that if we encounter a 0, we need to effectively "reset" our prefix product calculations from that point onwards.
// A good way to handle this is to store the prefix products in a list.
// When `getProduct(k)` is called, we can find the product of the last k numbers by dividing the prefix product at the current index (which represents the product of all numbers seen so far) by the prefix product at the index `size - k - 1`.
//
// Special Handling for Zero:
// If the last `k` numbers include a zero, the product will be 0. To detect this efficiently, we can store the index of the last encountered zero.
// If the index of the last zero is greater than or equal to `size - k`, it means the last `k` numbers contain a zero, and we can immediately return 0.
//
// Optimized Approach:
// Instead of storing all prefix products, we can optimize by only storing prefix products that are not zero.
// When a zero is encountered, we clear the list of prefix products and start anew.
// When `getProduct(k)` is called, if the list of prefix products is empty, it means all numbers were zero (or the stream is empty and k > 0, which is not allowed by constraints).
// Otherwise, we can calculate the product. If the size of our prefix product list is less than `k`, it means there were some zeros that "reset" the product, and we need to consider the product of the last available non-zero prefix products.
//
// Revised Optimized Approach for O(1) Add and GetProduct:
// To achieve O(1) for both `add` and `getProduct`, we can use a list to store prefix products.
// When `add(num)` is called:
// If `num` is 0, we reset the list of prefix products and add a 1 to represent the product of an empty sequence before the zero. This 1 acts as a base for future calculations.
// If `num` is not 0, we append the product of the last prefix product and `num` to the list. The first element of the list is always 1, representing the product before any numbers.
//
// When `getProduct(k)` is called:
// If the size of our prefix product list is less than or equal to `k`, it means there were enough zeros to effectively reset the product within the last `k` elements. Therefore, the product of the last `k` elements (including the effect of zeros) is 0.
// Otherwise, the product of the last `k` elements is `prefixProducts[size - 1] / prefixProducts[size - k - 1]`.
//
// Time Complexity:
// add(num): O(1) - Appending to a list and basic arithmetic operations take constant time.
// getProduct(k): O(1) - Accessing elements by index in a list and performing division takes constant time.
//
// Space Complexity:
// O(N), where N is the number of non-zero elements added to the stream. In the worst case, if no zeros are added, the space complexity will be O(M), where M is the total number of elements added.
class ProductOfNumbers {
    // This list will store prefix products.
    // The first element is always 1, representing the product before any numbers.
    // If a 0 is encountered, the list is reset, and a 1 is added as the new base.
    List<Integer> prefixProducts;

    public ProductOfNumbers() {
        // Initialize the list with 1. This serves as the base for prefix products.
        prefixProducts = new ArrayList<>();
        prefixProducts.add(1);
    }

    public void add(int num) {
        // If the number is 0, it will make all subsequent products 0.
        // We reset the prefixProducts list and start fresh from a product of 1.
        if (num == 0) {
            prefixProducts = new ArrayList<>();
            prefixProducts.add(1); // Add 1 as the new base product after a zero.
        } else {
            // If the number is not 0, calculate the new prefix product.
            // It's the product of the last prefix product and the current number.
            // We use integer division to keep the products within the integer range.
            int lastPrefixProduct = prefixProducts.get(prefixProducts.size() - 1);
            prefixProducts.add(lastPrefixProduct * num);
        }
    }

    public int getProduct(int k) {
        int n = prefixProducts.size();

        // If the number of prefix products (excluding the initial 1) is less than or equal to k,
        // it means that within the last k numbers added, there was at least one zero.
        // This zero would have reset the prefixProducts list.
        // Therefore, the product of the last k numbers is 0.
        if (n <= k) {
            return 0;
        }

        // If there are more than k prefix products, it means the last k numbers
        // did not contain a zero that reset the product calculation from the beginning.
        // The product of the last k numbers can be calculated by dividing
        // the current total prefix product (product of all numbers seen so far)
        // by the prefix product of the elements *before* the last k elements.
        // prefixProducts.get(n - 1) is the product of all numbers up to the current point.
        // prefixProducts.get(n - 1 - k) is the product of all numbers *before* the last k numbers.
        // The division gives us the product of exactly the last k numbers.
        return prefixProducts.get(n - 1) / prefixProducts.get(n - 1 - k);
    }
}
/**
 * Your ProductOfNumbers object will be instantiated and called as such:
 * ProductOfNumbers obj = new ProductOfNumbers();
 * obj.add(num);
 * int param_2 = obj.getProduct(k);
 */