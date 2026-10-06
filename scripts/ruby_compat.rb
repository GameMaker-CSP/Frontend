# Liquid 4.0.3 uses taint methods removed in Ruby 3.2. Taint tracking
# was already a no-op before removal; preserve that behavior on newer Ruby.
unless Object.method_defined?(:tainted?)
  class Object
    def tainted?
      false
    end

    def untaint
      self
    end
  end
end
